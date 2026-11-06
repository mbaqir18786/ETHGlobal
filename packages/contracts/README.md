# HexFence Safe Guard (`packages/contracts`)

## Overview
**HexFenceGuard** is an on-chain execution-time transaction guard for Gnosis Safe (`BaseGuard` / `IGuard` interface). It halts Ethereum vanity address-poisoning attacks at the point of execution by inspecting transaction payloads and reverting transactions when the recipient mimics an approved genuine payee.

---

## Technical Specifications
- **Solidity Version**: `^0.8.24` (EVM target: `cancun`)
- **Supported Frameworks**: Foundry & Hardhat
- **Deployment Network**: Sepolia Testnet (Chain ID `11155111`) & Ethereum Mainnet
- **Safe Compatibility**: Gnosis Safe v1.3.0 and v1.4.1

---

## Supported Transaction Formats
1. **Native ETH Transfers**:
   - Detected when `data.length == 0`.
   - Recipient evaluated directly from target `to` address.
2. **ERC-20 `transfer(address to, uint256 amount)`**:
   - Selector: `0xa9059cbb`.
   - Extracts recipient from `data[4:36]`.
3. **ERC-20 `transferFrom(address from, address to, uint256 amount)`**:
   - Selector: `0x23b872dd`.
   - Extracts recipient from `data[36:68]`.

---

## Documented Architectural Limitations
> [!IMPORTANT]
> The Safe Guard enforces high-assurance protection for individual transfers while gracefully handling unsupported formats without halting unrelated Safe operations:

1. **MultiSend Batches (`0x8d80ff0a`)**:
   - Batched multi-transactions routed through Gnosis MultiSend or MultiSendCallOnly library contracts are unsupported in the MVP.
   - When detected, the Guard safely permits execution and emits `UnsupportedFormatPassed(to, selector)` rather than triggering false-positive reverts.
2. **Safe Module Transactions**:
   - By Gnosis Safe core design, transactions triggered via enabled Safe Modules do **not** pass through transaction guards (`guard.checkTransaction` is only executed during owner-signed `execTransaction` calls).
3. **Vanity Collision Threshold**:
   - The on-chain lookalike detector checks for simultaneous collisions in both the leading 16 bits (first 4 hex characters) and trailing 16 bits (last 4 hex characters). This 32-bit collision entropy represents a 1-in-4,294,967,296 ($16^8$) probability, distinguishing deliberate GPU-brute-forced vanity spoofs from coincidence.

---

## Recovery Mechanisms
In the event of an unexpected edge-case or operational necessity, Safe owners have two independent recovery paths:
1. **Emergency Bypass Toggle**:
   - Safe owners can invoke `guard.setEmergencyBypass(true)` to temporarily disable all collision rejection checks without detaching the contract.
2. **Standard Safe Guard Removal**:
   - Safe owners can call `safe.setGuard(address(0))` on the Safe multisig to permanently unhook the guard and restore standard execution.

---

## Testing & Verification

### Running the Hardhat Suite (11/11 Passing Tests)
```bash
npm run --workspace=packages/contracts test
```

### Running Foundry Tests
```bash
forge test -vvv
```

### Verified Test Cases:
- [x] **Requirement 1**: Safe owner can approve genuine payees.
- [x] **Requirement 2**: Safe owner can remove approved payees.
- [x] **Requirement 3a**: Guard allows genuine approved native ETH transfers.
- [x] **Requirement 3b**: Guard allows genuine approved ERC-20 token transfers.
- [x] **Requirement 4a**: Guard identifies recipient lookalikes and reverts native ETH transfers (`LookalikePoisoningDetected`).
- [x] **Requirement 4b**: Guard identifies recipient lookalikes and reverts ERC-20 `transfer` calls.
- [x] **Requirement 4c**: Guard identifies recipient lookalikes and reverts ERC-20 `transferFrom` calls.
- [x] **Requirement 5**: Unauthorized callers cannot approve or remove payees (`UnauthorizedCaller`).
- [x] **Requirement 6a**: Recovery mechanism via `setEmergencyBypass` allows transactions.
- [x] **Requirement 6b**: Recovery mechanism via Safe removing Guard (`setGuard(address(0))`) unblocks execution.
- [x] **Requirement 7**: Unsupported transaction formats (custom selectors, generic contracts) pass through safely without false reverts.

---

## Sepolia Deployment
Deploy the contract to Sepolia testnet:
```bash
export SEPOLIA_RPC_URL="https://rpc.sepolia.org"
export PRIVATE_KEY="0x..."
export SEPOLIA_SAFE_ADDRESS="0x..."
node packages/contracts/scripts/deploy-guard.js
```

