// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../contracts/HexFenceGuard.sol";

interface ScriptVm {
    function startBroadcast() external;
    function stopBroadcast() external;
    function envAddress(string memory) external returns (address);
}

contract DeployGuard {
    ScriptVm constant vm = ScriptVm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    function run() external returns (HexFenceGuard guard) {
        address deployer = msg.sender;
        address safeAddress = deployer;

        vm.startBroadcast();
        guard = new HexFenceGuard(deployer, safeAddress);
        vm.stopBroadcast();
    }
}

