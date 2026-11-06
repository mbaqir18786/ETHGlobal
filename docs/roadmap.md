# HexFence Development Roadmap

This roadmap outlines the systematic, phased delivery plan for HexFence. In accordance with project rules, no phase proceeds until the prior phase has been verified and tested.

---

## Milestone 0: Inspection & Architectural Blueprints (Current)
- **Status**: Completed.
- **Objective**: Establish foundational workspace structure, architectural contracts, security specifications, and toolchain verification.

---

## Milestone 1: Shared Core & Tooling Scaffold
- **Focus**: Setting up monorepo workspaces, shared types, Zod schemas, and TypeScript tooling.
- **Outputs**:
  - `packages/config` containing `tsconfig.base.json`.
  - `packages/shared` exporting typed domain models for address risk, Arkiv proofs, and Safe Guard payloads.
- **Verification**: `npm run build` succeeds across shared workspaces with zero type errors.

---

## Milestone 2: Algorithmic Detection Engine Core
- **Focus**: Engine implementation in `services/detector`.
- **Outputs**:
  - Prefix/suffix vanity collision algorithms with configurable tolerance.
  - Zero-value and dust transfer heuristics.
  - Directional entropy and history analysis.
- **Verification**: High-coverage unit tests running real-world Ethereum address-poisoning incidents (e.g., the \$68M WBTC poisoning incident pattern).

---

## Milestone 3: Arkiv Public Evidence Protocol Layer
- **Focus**: Tamper-proof evidence anchoring.
- **Outputs**:
  - Canonical JSON-LD proof generator.
  - Cryptographic hash and signature verification.
  - Arkiv gateway client adapter.
- **Verification**: Proofs serialized, verified, and round-tripped with cryptographically valid signatures.

---

## Milestone 4: Solidity Smart Contracts & Safe Guard
- **Focus**: On-chain defense in `packages/contracts`.
- **Outputs**:
  - `HexFenceGuard.sol` implementing Gnosis Safe `BaseGuard`.
  - Registry of confirmed poisoned vanity addresses.
  - `checkTransaction()` pre-execution validation hook.
- **Verification**: Hardhat tests simulating multi-sig transaction execution to genuine vs. poisoned recipients.

---

## Milestone 5: Backend API & Database with RBAC
- **Focus**: RESTful services in `services/api`.
- **Outputs**:
  - Prisma schema with SQLite / PostgreSQL.
  - JWT authentication and role-based access control (`USER`, `ADMIN`, `SUPER_ADMIN`).
  - Endpoints for address risk checks, incident reporting, and monitored wallets.
- **Verification**: Automated integration tests verifying authenticated routes, authorization restrictions, and risk check outputs.

---

## Milestone 6: Web Management Portal & Explorer
- **Focus**: User interfaces in `apps/web` and `apps/explorer`.
- **Outputs**:
  - Refined Neo-Brutalist design system with high-contrast palette and `IBM Plex Mono` address rendering.
  - Interactive Address Inspector highlighting exact mismatched characters in real time.
  - Public Arkiv Evidence Explorer.
  - Safe Guard installation and registration guide.
  - Admin & Super Admin incident management portal.
- **Verification**: Component and page integration tests, responsive layout validation, and accessibility verification.

---

## Milestone 7: Manifest V3 Browser Extension
- **Focus**: Client defense in `apps/extension`.
- **Outputs**:
  - Background service worker.
  - Non-invasive content script monitoring paste and input events.
  - Injected Neo-Brutalist warning modal alerting users to vanity collisions before transaction signing.
- **Verification**: Local extension load and simulated paste intercept test in Chrome environment.

---

## Milestone 8: Full-System Integration & Delivery
- **Focus**: End-to-end attack simulation and readiness audit.
- **Outputs**:
  - Unified multi-surface defense test: Simulated dust transfer -> Detector detection -> Extension warning -> Arkiv proof anchoring -> Safe Guard transaction revert.
  - Documentation and deployment guides.

