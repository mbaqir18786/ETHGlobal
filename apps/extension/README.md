# HexFence Safe Guard Chrome Extension (`apps/extension`)

## Overview
**HexFence Chrome Extension** is an on-device transaction-checking extension built for **Safe (`app.safe.global`) on Sepolia Testnet** and Ethereum Mainnet. It intercepts transaction preparation in real time and guards users against vanity address-poisoning attacks before signing.

---

## Key Architecture & Features

### 1. Manifest V3 & Native Safe Hooking
- Built on **Chrome Manifest V3**.
- **Content Script (`src/content/content.ts`)**: Injected into `https://app.safe.global/*`. Observes transaction drafting modals and recipient inputs.
- **Background Worker (`src/background/background.ts`)**: Decodes calldata and triggers a dedicated security window.
- **Standalone Warning Window (`warning.html`)**: Opens an isolated, focused alert window (`480x640`) displaying vanity collision forensics, entropy math, and clear action buttons.

### 2. Transaction Decoding
- **Native ETH Transfers**: Decodes `to` recipient and native value.
- **ERC-20 `transfer(address to, uint256 amount)`**: Decodes recipient from selector `0xa9059cbb`.
- **ERC-20 `transferFrom(address from, address to, uint256 amount)`**: Decodes recipient from selector `0x23b872dd`.
- **Unsupported & MultiSend Detection**: MultiSend batches (`0x8d80ff0a`) and generic smart contracts are flagged as `UNSUPPORTED`.

---

## The Four Strict Warning States

| State | Visual Badge | Classification Rule | Safety Guarantee |
|---|---|---|---|
| **`SUSPICIOUS_LOOKALIKE`** | **Critical Red** (`#D94F4F`) | Recipient matches prefix & suffix of an approved payee or known Arkiv incident, but is not the genuine address. | Halts execution. Warns user of clipboard poisoning. |
| **`APPROVED_PAYEE`** | **Safe Green** (`#2E7D52`) | Recipient exactly matches a verified address in the Safe approved payees registry. | Safe to sign. |
| **`NO_MATCHING_EVIDENCE`** | **Neutral Charcoal** (`#151515`) | Recipient does not match approved payees or indexed Arkiv threat records. | **Absence of evidence is NOT proof of safety.** Requires manual 42-char verification. |
| **`CANNOT_VERIFY`** | **Amber Warning** (`#D97706`) | MultiSend batch, custom governance call, or unrecognized contract interaction. | **CRITICAL: Unknown or unsupported formats NEVER receive a false green safety result.** |

---

## Privacy Architecture: Zero Recipient Leakage

1. **Bulk Snapshot Downloads**:
   - The extension downloads threat evidence from Arkiv in bulk (`/api/evidence/arkiv/recent?limit=500`) and caches it in `chrome.storage.local`.
2. **100% On-Device Matching**:
   - Every prefix, suffix, and Hamming collision calculation runs locally inside the browser's JavaScript sandbox.
3. **No Recipient Querying**:
   - The extension **never sends recipient addresses to the HexFence backend** or any third-party analytics service.
4. **Realistic Privacy Boundary**:
   - While on-device matching prevents recipient leakage to HexFence servers, public RPC nodes and block explorers observe broadcasted transactions upon execution. We do not claim complete network-level anonymity.

---

## English and Hindi i18n Support
- Full bilingual dictionary (`src/i18n/translations.ts`) supporting **English (`en`)** and **Hindi (`hi`)**.
- Switchable anytime via the language dropdown in both the toolbar popup and the standalone warning dialog.

---

## Testing & Installation

### 1. Build Extension
```bash
npm run --workspace=apps/extension build
```

### 2. Run Test Suite (11/11 Passing Tests)
```bash
npm run --workspace=apps/extension test
```

### 3. Load in Google Chrome
1. Navigate to `chrome://extensions/` in Chrome.
2. Enable **Developer mode** (toggle in top right).
3. Click **Load unpacked**.
4. Select the directory: `apps/extension`.
5. Open the HexFence popup to access the **Local Verification Lab**, test presets (Lookalike, Approved, Unknown), or draft a transaction on `app.safe.global`.

