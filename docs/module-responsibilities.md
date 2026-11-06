# HexFence Module Responsibilities & System Boundaries

This document defines the exact scope, boundaries, inputs, and outputs of each module across the HexFence platform.

---

## 1. Apps

### 1.1 `apps/web` (Core Management & Investigation Portal)
- **Role**: Primary user-facing web interface.
- **Responsibilities**:
  - Safe Guard deployment and registration wizard.
  - User wallet monitoring setup (adding monitored addresses).
  - RBAC management portal for `USER`, `ADMIN`, and `SUPER_ADMIN`.
  - Manual address verification tool with visual vanity diff analyzer.
- **Boundaries**:
  - Does NOT directly connect to private blockchain keys.
  - Does NOT store administrative credentials in client storage.
  - Communicates exclusively with `services/api`.

### 1.2 `apps/explorer` (Public Arkiv Evidence Explorer)
- **Role**: Public, open-access forensic search engine.
- **Responsibilities**:
  - Query addresses, transactions, and Arkiv proof identifiers.
  - Display full forensic receipts, including mimicked address, poisoner vanity address, timestamp, and heuristic scores.
  - Render verifiable cryptographic signature receipts linked to the Arkiv protocol.
- **Boundaries**:
  - Read-only interface.
  - No user authentication required for public exploration.

### 1.3 `apps/extension` (Manifest V3 Browser Defense)
- **Role**: Real-time client interceptor for web browsers.
- **Responsibilities**:
  - Listen for address input events and paste actions in active web tabs.
  - Match candidate address against locally cached counterparties and query `services/api`.
  - Inject instant visual alerts and character diff banners when vanity similarity exceeds threat thresholds.
- **Boundaries**:
  - Never reads or intercepts private keys, passwords, or seed phrases.
  - Operates strictly with passive clipboard/input heuristic inspection.

---

## 2. Services

### 2.1 `services/api` (Backend API & Gateway)
- **Role**: Central communication hub and state orchestrator.
- **Responsibilities**:
  - Expose RESTful endpoints for address risk checking, incident reporting, and stats.
  - Manage database entities via Prisma (Users, Wallets, Incidents, SafeGuards).
  - Enforce authentication (JWT) and role-based permissions (`USER`, `ADMIN`, `SUPER_ADMIN`).
  - Coordinate proof generation and retrieval with `services/detector` and Arkiv.
- **Boundaries**:
  - Server-side only; never exposes database connection strings or master secrets to clients.

### 2.2 `services/detector` (Address-Poisoning Detection Engine)
- **Role**: Algorithmic security engine.
- **Responsibilities**:
  - Compute prefix and suffix string distances (Hamming / Levenshtein) on Ethereum addresses.
  - Score vanity match probability ($P_{collision} = 16^{-(L_{pre} + L_{suf})}$).
  - Analyze transfer logs for dust (< 0.0001 ETH) and zero-value ERC-20 transfers.
  - Produce standardized `AddressRiskAssessment` objects.
- **Boundaries**:
  - Stateless algorithmic processing with RPC queries for transaction history verification.

### 2.3 `services/ivr` (Urgent Multi-Sig Voice Notification Worker)
- **Role**: Optional asynchronous emergency notification pipeline.
- **Responsibilities**:
  - Ingest webhook triggers when a monitored Safe or VIP treasury initiates a transaction flagged as suspicious.
  - Dispatch automated voice alerts via Twilio IVR to registered security officers before transaction threshold execution.
- **Boundaries**:
  - Optional service; operates asynchronously without blocking transaction execution.

---

## 3. Packages

### 3.1 `packages/shared` (Shared Types & Schemas)
- **Role**: Single source of truth for platform data structures.
- **Responsibilities**:
  - Export TypeScript interfaces (`AddressRiskAssessment`, `ArkivEvidenceProof`, `UserRole`, `SafeTransactionCheck`).
  - Export runtime validation schemas (Zod).
  - Export system constants (confidence thresholds, design token hex codes).
- **Boundaries**:
  - Zero platform-specific dependencies (pure TypeScript).

### 3.2 `packages/config` (Shared Tooling Configs)
- **Role**: Uniform linting, TypeScript, and styling configurations.
- **Responsibilities**:
  - `tsconfig.base.json`: Base TypeScript compiler options.
  - ESLint rules and Prettier configuration.
  - Tailwind preset with HexFence Neo-Brutalist color and border tokens.

### 3.3 `packages/contracts` (Solidity Smart Contracts & Guard)
- **Role**: On-chain enforcement layer.
- **Responsibilities**:
  - Implement `HexFenceGuard.sol` adhering to Gnosis Safe `BaseGuard` interface.
  - Implement `checkTransaction` hook to revert execution if destination address matches a confirmed poisoner.
  - Deployable to Ethereum Sepolia and Mainnet.
  - Comprehensive unit and integration test suite.

