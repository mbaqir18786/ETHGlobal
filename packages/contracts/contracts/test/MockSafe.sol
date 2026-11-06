// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../HexFenceGuard.sol";

/**
 * @title MockSafe
 * @dev Emulates Gnosis Safe execution flow with Guard checkTransaction hooks
 */
contract MockSafe {
    address public owner;
    IGuard public guard;

    event ExecutionSuccess(bytes32 txHash);
    event ExecutionFailure(bytes32 txHash);
    event ChangedGuard(address guard);

    modifier onlyOwner() {
        require(msg.sender == owner, "MockSafe: caller is not owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function setGuard(address _guard) external onlyOwner {
        guard = IGuard(_guard);
        emit ChangedGuard(_guard);
    }

    function execTransaction(
        address to,
        uint256 value,
        bytes memory data,
        uint8 operation
    ) external payable returns (bool success) {
        bytes32 txHash = keccak256(abi.encodePacked(to, value, data, operation, block.timestamp));

        // 1. Guard check
        if (address(guard) != address(0)) {
            guard.checkTransaction(
                to,
                value,
                data,
                operation,
                0,
                0,
                0,
                address(0),
                payable(address(0)),
                "",
                msg.sender
            );
        }

        // 2. Execute call
        (success, ) = to.call{value: value}(data);
        require(success, "MockSafe: execution failed");

        // 3. Guard post-check
        if (address(guard) != address(0)) {
            guard.checkAfterExecution(txHash, success);
        }

        emit ExecutionSuccess(txHash);
        return success;
    }

    receive() external payable {}
}

