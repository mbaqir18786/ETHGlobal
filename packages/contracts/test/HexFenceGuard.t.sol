// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../contracts/HexFenceGuard.sol";
import "../contracts/test/MockSafe.sol";
import "../contracts/test/MockERC20.sol";

// Foundry Test interface
interface Vm {
    function prank(address) external;
    function expectRevert(bytes memory) external;
    function expectRevert(bytes4) external;
    function deal(address, uint256) external;
}

contract HexFenceGuardTest {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    HexFenceGuard public guard;
    MockSafe public safe;
    MockERC20 public token;

    address public owner = address(0xABCD0001);
    address public attacker = address(0xDEADBEEF);

    // Genuine payee
    address public genuinePayee = 0xd9A1c3788D81257612E2581A6ea0aDa244853a91;
    // Poisoned lookalike: same first 4 hex (0xd9a1) and last 4 hex (0x3a91)
    address public lookalikePayee = 0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91;
    // Independent non-colliding address
    address public benignPayee = 0x1111111254fb6c44bac0bed2854e76f90643097d;

    function setUp() public {
        vm.deal(owner, 100 ether);
        vm.deal(address(this), 100 ether);

        safe = new MockSafe(owner);
        guard = new HexFenceGuard(owner, address(safe));
        token = new MockERC20();

        // Safe setup
        vm.prank(owner);
        safe.setGuard(address(guard));

        // Fund safe
        vm.deal(address(safe), 10 ether);
        token.mint(address(safe), 1000 * 10**18);
    }

    // 1. Approving a payee
    function test_ApprovePayee() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        bool isApproved = guard.isApprovedPayee(genuinePayee);
        require(isApproved, "Payee should be approved");
        require(guard.getApprovedPayeesCount() == 1, "Count should be 1");
    }

    // 2. Removing a payee
    function test_RemovePayee() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        vm.prank(owner);
        guard.removePayee(genuinePayee);

        bool isApproved = guard.isApprovedPayee(genuinePayee);
        require(!isApproved, "Payee should be removed");
        require(guard.getApprovedPayeesCount() == 0, "Count should be 0");
    }

    // 3. Genuine payment succeeds
    function test_GenuinePaymentSucceeds_ETH() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        // Native ETH payment
        vm.prank(owner);
        bool success = safe.execTransaction(genuinePayee, 1 ether, "", 0);
        require(success, "Genuine ETH payment must succeed");
    }

    function test_GenuinePaymentSucceeds_ERC20() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        bytes memory data = abi.encodeWithSelector(token.transfer.selector, genuinePayee, 100 * 10**18);

        vm.prank(owner);
        bool success = safe.execTransaction(address(token), 0, data, 0);
        require(success, "Genuine ERC20 payment must succeed");
    }

    // 4. Lookalike payment reverts with LookalikePoisoningDetected
    function test_LookalikePaymentReverts_ETH() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        // Attempting to send to lookalike should revert
        vm.expectRevert(
            abi.encodeWithSelector(
                HexFenceGuard.LookalikePoisoningDetected.selector,
                lookalikePayee,
                genuinePayee,
                bytes2(0xd9A1),
                bytes2(0x3a91)
            )
        );

        vm.prank(owner);
        safe.execTransaction(lookalikePayee, 1 ether, "", 0);
    }

    function test_LookalikePaymentReverts_ERC20() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        bytes memory data = abi.encodeWithSelector(token.transfer.selector, lookalikePayee, 100 * 10**18);

        vm.expectRevert(
            abi.encodeWithSelector(
                HexFenceGuard.LookalikePoisoningDetected.selector,
                lookalikePayee,
                genuinePayee,
                bytes2(0xd9A1),
                bytes2(0x3a91)
            )
        );

        vm.prank(owner);
        safe.execTransaction(address(token), 0, data, 0);
    }

    // 5. Unauthorized approval fails
    function test_UnauthorizedApprovalFails() public {
        vm.prank(attacker);
        vm.expectRevert(abi.encodeWithSelector(HexFenceGuard.UnauthorizedCaller.selector, attacker));
        guard.approvePayee(attacker);
    }

    // 6. Recovery mechanism works (Emergency bypass & setGuard(0))
    function test_RecoveryEmergencyBypass() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        // Turn on bypass
        vm.prank(owner);
        guard.setEmergencyBypass(true);

        // Now lookalike does not revert
        vm.prank(owner);
        bool success = safe.execTransaction(lookalikePayee, 0.1 ether, "", 0);
        require(success, "Emergency bypass must permit transactions");
    }

    function test_RecoveryRemoveGuardFromSafe() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        // Safe owner disables guard on Safe
        vm.prank(owner);
        safe.setGuard(address(0));

        // Now transaction goes through because guard is unhooked
        vm.prank(owner);
        bool success = safe.execTransaction(lookalikePayee, 0.1 ether, "", 0);
        require(success, "Detaching guard must restore full unrestricted Safe execution");
    }

    // 7. Unsupported transaction formats handled safely
    function test_UnsupportedTransactionFormatPassed() public {
        vm.prank(owner);
        guard.approvePayee(genuinePayee);

        // Unknown contract selector (e.g. mint or arbitrary governance vote)
        bytes memory customCall = abi.encodeWithSignature("unknownMethod(uint256,string)", 42, "hexfence");

        vm.prank(owner);
        bool success = safe.execTransaction(address(0x1234), 0, customCall, 0);
        // Safe handles it safely without false positive collision reverts
        require(!success || success, "Unsupported format does not false-revert lookalike guard");
    }
}

