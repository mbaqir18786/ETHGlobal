// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title HexFence Safe Guard (Gnosis Safe Transaction Guard)
 * @notice Execution-time protection against Ethereum vanity address-poisoning attacks.
 * @dev Intercepts Safe transactions prior to execution and rejects recipient addresses
 *      that mimic approved genuine payees (matching leading and trailing vanity characters).
 *
 * Architecture & Limitations:
 * 1. Supports native ETH transfers (data.length == 0).
 * 2. Supports standard ERC-20 transfer(address,uint256) and transferFrom(address,address,uint256).
 * 3. Safe Module transactions do NOT pass through Safe Guards (Gnosis Safe core architecture).
 * 4. MultiSend batches are unsupported in MVP and are safely passed through without false revert.
 * 5. Recovery: Safe owner can disable guard via setGuard(address(0)) on Safe or use emergencyBypass.
 */

interface IGuard {
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        uint8 operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external;

    function checkAfterExecution(bytes32 txHash, bool success) external;
}

contract HexFenceGuard is IGuard {
    // =========================================================================
    // CONSTANTS & SELECTORS
    // =========================================================================
    // bytes4(keccak256("transfer(address,uint256)"))
    bytes4 private constant ERC20_TRANSFER_SELECTOR = 0xa9059cbb;
    // bytes4(keccak256("transferFrom(address,address,uint256)"))
    bytes4 private constant ERC20_TRANSFER_FROM_SELECTOR = 0x23b872dd;

    // =========================================================================
    // CUSTOM ERRORS
    // =========================================================================
    error UnauthorizedCaller(address caller);
    error InvalidZeroAddress();
    error PayeeAlreadyApproved(address payee);
    error PayeeNotRegistered(address payee);
    error EmergencyBypassActive();
    error LookalikePoisoningDetected(
        address recipient,
        address mimickedPayee,
        bytes2 matchingPrefix,
        bytes2 matchingSuffix
    );

    // =========================================================================
    // EVENTS
    // =========================================================================
    event PayeeApproved(address indexed payee, address indexed addedBy);
    event PayeeRemoved(address indexed payee, address indexed removedBy);
    event EmergencyBypassToggled(bool enabled, address indexed toggledBy);
    event LookalikeBlocked(
        address indexed recipient,
        address indexed mimickedPayee,
        bytes2 matchingPrefix,
        bytes2 matchingSuffix
    );
    event UnsupportedFormatPassed(address indexed to, bytes4 selector);
    event TransactionChecked(address indexed recipient, bool isApproved);

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================
    address public owner;
    address public safeAccount;
    bool public emergencyBypass;

    // Registered genuine payees
    mapping(address => bool) public isApprovedPayee;
    address[] public approvedPayees;

    // =========================================================================
    // MODIFIERS
    // =========================================================================
    modifier onlyOwnerOrSafe() {
        if (msg.sender != owner && msg.sender != safeAccount) {
            revert UnauthorizedCaller(msg.sender);
        }
        _;
    }

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================
    constructor(address _owner, address _safeAccount) {
        if (_owner == address(0)) revert InvalidZeroAddress();
        owner = _owner;
        safeAccount = _safeAccount;
        emergencyBypass = false;
    }

    // =========================================================================
    // PAYEE MANAGEMENT
    // =========================================================================

    /**
     * @notice Authorizes a genuine payee address
     * @param payee The legitimate counterparty wallet address to approve
     */
    function approvePayee(address payee) external onlyOwnerOrSafe {
        if (payee == address(0)) revert InvalidZeroAddress();
        if (isApprovedPayee[payee]) revert PayeeAlreadyApproved(payee);

        isApprovedPayee[payee] = true;
        approvedPayees.push(payee);

        emit PayeeApproved(payee, msg.sender);
    }

    /**
     * @notice Revokes approval for a payee
     * @param payee The payee address to remove
     */
    function removePayee(address payee) external onlyOwnerOrSafe {
        if (!isApprovedPayee[payee]) revert PayeeNotRegistered(payee);

        isApprovedPayee[payee] = false;

        // Clean up approvedPayees array
        uint256 length = approvedPayees.length;
        for (uint256 i = 0; i < length; i++) {
            if (approvedPayees[i] == payee) {
                approvedPayees[i] = approvedPayees[length - 1];
                approvedPayees.pop();
                break;
            }
        }

        emit PayeeRemoved(payee, msg.sender);
    }

    /**
     * @notice Returns all currently approved payees
     */
    function getApprovedPayees() external view returns (address[] memory) {
        return approvedPayees;
    }

    /**
     * @notice Total count of approved payees
     */
    function getApprovedPayeesCount() external view returns (uint256) {
        return approvedPayees.length;
    }

    // =========================================================================
    // RECOVERY MECHANISM
    // =========================================================================

    /**
     * @notice Emergency toggle to bypass guard checks without removing guard contract
     * @param enabled True to bypass all lookalike checks, false to re-enable
     */
    function setEmergencyBypass(bool enabled) external onlyOwnerOrSafe {
        emergencyBypass = enabled;
        emit EmergencyBypassToggled(enabled, msg.sender);
    }

    /**
     * @notice Update linked Safe account
     */
    function setSafeAccount(address _safeAccount) external onlyOwnerOrSafe {
        safeAccount = _safeAccount;
    }

    // =========================================================================
    // SAFE GUARD INTERFACE (CHECK TRANSACTION)
    // =========================================================================

    /**
     * @notice Gnosis Safe pre-execution transaction inspection hook
     */
    function checkTransaction(
        address to,
        uint256 /* value */,
        bytes memory data,
        uint8 /* operation */,
        uint256 /* safeTxGas */,
        uint256 /* baseGas */,
        uint256 /* gasPrice */,
        address /* gasToken */,
        address payable /* refundReceiver */,
        bytes memory /* signatures */,
        address /* msgSender */
    ) external override {
        // 1. Check emergency bypass
        if (emergencyBypass) {
            return;
        }

        // 2. Extract intended payment recipient
        address recipient = address(0);
        bool isSupportedTransfer = false;

        if (data.length == 0) {
            // Case A: Native ETH transfer
            recipient = to;
            isSupportedTransfer = true;
        } else if (data.length >= 68) {
            bytes4 selector;
            assembly {
                selector := mload(add(data, 32))
            }

            if (selector == ERC20_TRANSFER_SELECTOR) {
                // Case B: ERC-20 transfer(address to, uint256 amount)
                assembly {
                    recipient := mload(add(data, 36))
                }
                isSupportedTransfer = true;
            } else if (selector == ERC20_TRANSFER_FROM_SELECTOR && data.length >= 100) {
                // Case C: ERC-20 transferFrom(address from, address to, uint256 amount)
                assembly {
                    recipient := mload(add(data, 68))
                }
                isSupportedTransfer = true;
            } else {
                // Unsupported transaction selector (e.g. MultiSend or contract calls)
                emit UnsupportedFormatPassed(to, selector);
                return;
            }
        } else {
            // Unrecognized data format (non-standard call); allow pass-through
            emit UnsupportedFormatPassed(to, bytes4(0));
            return;
        }

        // If transfer format recognized, perform lookalike defense verification
        if (isSupportedTransfer && recipient != address(0)) {
            verifyRecipientSafety(recipient);
        }
    }

    /**
     * @notice Safe post-execution hook
     */
    function checkAfterExecution(bytes32 /* txHash */, bool /* success */) external pure override {
        // No post-execution actions required
    }

    // =========================================================================
    // LOOKALIKE DETECTION ALGORITHM
    // =========================================================================

    /**
     * @notice Evaluates recipient against all approved payees for vanity collision
     * @dev Checks prefix (leading 16 bits = 4 hex chars) and suffix (trailing 16 bits = 4 hex chars).
     *      A combined 32-bit match (1 in 4.29 billion entropy) indicates an intentional vanity lookalike.
     */
    function verifyRecipientSafety(address recipient) public view {
        // 1. If recipient is already explicitly approved, pass immediately
        if (isApprovedPayee[recipient]) {
            return;
        }

        // 2. Extract recipient prefix (leading 16 bits) and suffix (trailing 16 bits)
        uint16 recipientPrefix = uint16(uint160(recipient) >> 144);
        uint16 recipientSuffix = uint16(uint160(recipient));

        uint256 count = approvedPayees.length;
        for (uint256 i = 0; i < count; i++) {
            address genuinePayee = approvedPayees[i];

            uint16 payeePrefix = uint16(uint160(genuinePayee) >> 144);
            uint16 payeeSuffix = uint16(uint160(genuinePayee));

            // Vanity collision check: matching prefix AND matching suffix, but different address
            if (
                recipientPrefix == payeePrefix &&
                recipientSuffix == payeeSuffix &&
                recipient != genuinePayee
            ) {
                revert LookalikePoisoningDetected(
                    recipient,
                    genuinePayee,
                    bytes2(payeePrefix),
                    bytes2(payeeSuffix)
                );
            }
        }
    }
}

