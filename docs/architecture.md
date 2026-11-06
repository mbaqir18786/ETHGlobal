# HexFence Architecture Specification

## 1. Overview
HexFence is a defense-in-depth security infrastructure platform engineered specifically to detect, log, mitigate, and prevent Ethereum address-poisoning attacks.

Address poisoning manipulates transaction history to fool wallet users into copying vanity addresses that share identical prefix and suffix characters with legitimate counterparties. HexFence counteracts this vector across 5 architectural layers:
1. **Detection Layer (`services/detector`)**
2. **Evidence Layer (`packages/shared` / Arkiv Protocol)**
3. **Smart Contract Enforcement Layer (`packages/contracts`)**
4. **Client-Side Interception Layer (`apps/extension`)**
5. **Investigation & Administration Layer (`apps/web` & `apps/explorer`)**

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Client Surfaces"]
        Ext["Chrome Extension (MV3)<br/>DOM & Clipboard Guard"]
        WebPortal["HexFence Web<br/>Safe Guard Setup & RBAC"]
        Explorer["Arkiv Evidence Explorer<br/>Public Incident Triage"]
    end

    subgraph EdgeServices["Backend & Security Services"]
        APIService["HexFence Core API<br/>Fastify/Express (TypeScript)"]
        DetectorService["Detection Engine<br/>Vanity Matcher & Dust Analyzer"]
        IVRService["IVR Notification Worker<br/>Urgent Multi-Sig Alert"]
    end

    subgraph DataStore["State & Evidence Store"]
        DB[(Prisma PostgreSQL / SQLite)]
        ArkivProtocol[("Arkiv Decentralized<br/>Evidence Protocol")]
    end

    subgraph OnChain["On-Chain Layer"]
        Safe["Gnosis Safe (Multi-Sig)"]
        Guard["HexFenceGuard.sol<br/>(BaseGuard)"]
        EthereumNode["Ethereum Node (RPC)"]
    end

    Ext -->|Check Recipient Risk| APIService
    WebPortal -->|Authenticate & Manage| APIService
    Explorer -->|Fetch Verified Incidents| APIService
    APIService -->|Query & Cache| DB
    APIService -->|Invoke Analysis| DetectorService
    DetectorService -->|Scan Chain & Mempool| EthereumNode
    DetectorService -->|Anchor Evidence Receipt| ArkivProtocol
    APIService -->|Fetch Proofs| ArkivProtocol

    Safe -->|checkTransaction()| Guard
    Guard -->|Enforce Verified Destination| Guard
    Guard -.->|Trigger Urgent Notification| IVRService
```

---

## 3. Layer Specifications

### 3.1 Detection Service (`services/detector`)
The detector service is an algorithmic heuristic processing engine capable of assessing candidate addresses against historical counterparty patterns:
- **Vanity Match Index ($VMI$)**: Computes prefix collision length ($L_{pre}$) and suffix collision length ($L_{suf}$). When $L_{pre} \ge 4$ and $L_{suf} \ge 4$ against an established counterparty address while differing in the middle, $VMI$ flags high confidence.
- **Dust & Zero-Value Transfer Detection**: Evaluates whether an address was introduced to a wallet via a `0`-value token transfer or sub-cent dust transaction ($< 0.0001$ ETH / USDT).
- **Directional Entropy Check**: Determines whether the victim has ever initiated an outgoing transfer to the candidate address.
- **Risk Scoring**:
  - `0 - 20`: `SAFE`
  - `21 - 60`: `SUSPICIOUS`
  - `61 - 100`: `CRITICAL_POISONED`

### 3.2 Arkiv Evidence Layer (`packages/shared` / Arkiv Integration)
Every confirmed poisoning incident generates a canonical **Arkiv Evidence Proof**:
- **Payload**:
  - Target Address (Victim)
  - Poisoner Address (Malicious vanity)
  - Mimicked Address (Legitimate counterparty)
  - First observed poisoning transaction hash
  - Heuristic score vector & character collision breakdown
  - Reporter identity / detection engine timestamp
- **Decentralized Anchoring**:
  - Signed with the HexFence protocol key and published to Arkiv namespace `hexfence-evidence`.
  - Immutable, globally readable, and cryptographically verifiable.

### 3.3 On-Chain Safe Guard (`packages/contracts`)
Implements the Gnosis Safe `BaseGuard` interface (`checkTransaction` and `checkAfterExecution`):
- When a Safe transaction is proposed or executed, the Safe contract delegates control to `HexFenceGuard.sol`.
- **Pre-execution validation**:
  - Confirms the destination address is not registered in the poisoned registry.
  - Verifies counterparty verification signatures or whitelist status.
  - If a transaction targets a confirmed poisoner, execution reverts immediately, shielding multi-sig treasuries from human copy-paste errors.

### 3.4 Chrome Browser Extension (`apps/extension`)
A lightweight Manifest V3 extension:
- Content script injects non-invasive listeners into clipboard paste events and address input elements on major dApps (Uniswap, Etherscan, Safe Web App, OpenSea).
- Real-time address matching: Compares input addresses against cached known counterparties.
- When a vanity collision is detected, a prominent Neo-Brutalist visual banner highlights the exact mismatched characters in `#D94F4F` red with warnings before signing.

### 3.5 Web Application & Evidence Explorer (`apps/web` & `apps/explorer`)
- **`apps/web`**: Multi-tenant dashboard offering Safe Guard deployment guides, wallet monitoring registration, and role-based administration (`USER`, `ADMIN`, `SUPER_ADMIN`).
- **`apps/explorer`**: Public transparency portal allowing any Web3 user to enter an address or transaction hash, inspect Arkiv cryptographic proofs, and explore known poisoner clusters.

---

## 4. Security Principles
- **No Private Key Ingestion**: HexFence client applications never request or process private keys or mnemonic seed phrases.
- **Server-Side Enforcement**: All access control and rate-limiting rules are enforced at the API gateway layer.
- **Factual Integrity**: No fabricated on-chain records. Demo records are explicitly typed and rendered with `[DEMO DATA]` badges.

