# HexFence 🛡️
> Enterprise-grade Ethereum Address-Poisoning Defense & Evidence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=20](https://img.shields.io/badge/node->=20.0.0-green.svg)](https://nodejs.org/)
[![Style: Neo-Brutalist](https://img.shields.io/badge/design-Refined_Neo--Brutalism-c6f36b.svg)](#design-identity)

HexFence protects Web3 users, multi-sig signers, and automated treasuries from **Address Poisoning Attacks**. Address poisoning occurs when malicious actors deploy vanity addresses matching the first and last characters of a victim's frequent counterparty, then pollute transaction histories with zero-value or dust transfers in hopes the victim inadvertently copies the wrong address.

HexFence introduces a coordinated multi-surface defense:
1. **Algorithmic Poisoning Detection Engine**: Real-time evaluation of prefix/suffix entropy matching, zero-value transfer markers, and counterparty divergence.
2. **Arkiv Public Evidence Layer**: Tamper-proof, decentralized storage of forensic incident receipts and malicious vanity clusters.
3. **On-Chain Safe Guard**: Custom Gnosis Safe `BaseGuard` contract (`HexFenceGuard.sol`) blocking executions targeting poisoned or unverified addresses.
4. **Client-Side Manifest V3 Chrome Extension**: Intercepts clipboard pastes and dApp form inputs, exposing character-level visual diffs.
5. **Public Intelligence Portal & Explorer**: Refined Neo-Brutalist investigation suite for address triage, Arkiv proof inspection, and RBAC administration.

---

## Workspace Structure

```
ETHGlobal/
├── apps/
│   ├── web/               # Next.js web application (Dashboard, RBAC, Safe Guard setup)
│   ├── explorer/          # Public incident & Arkiv evidence exploration portal
│   └── extension/         # Manifest V3 Chrome Extension (real-time input/paste defense)
├── services/
│   ├── api/               # Express/Fastify TypeScript API with Prisma ORM & RBAC
│   ├── detector/          # Address poisoning heuristic engine & mempool analyzer
│   └── ivr/               # Optional Twilio IVR voice notification service for urgent multi-sig alerts
├── packages/
│   ├── shared/            # Shared TypeScript types, schemas (Zod), and constants
│   ├── config/            # Shared TypeScript, ESLint, and Tailwind configurations
│   └── contracts/         # Hardhat/Foundry Solidity suite (HexFenceGuard, mocks, tests)
├── docs/                  # Architectural specs, module guides, roadmap, and checklists
├── .env.example           # Global environment variable documentation
└── package.json           # Monorepo workspaces manifest
```

---

## Design Identity: Refined Neo-Brutalism

HexFence avoids generic SaaS dashboard templates, neon cyberpunk effects, and fake telemetry. It adheres strictly to **Refined Neo-Brutalism**:
- **Background**: `#F4F2EC` (Bone Canvas)
- **Surfaces**: `#FFFFFF` with rigid `1.5px`–`2px` `#171717` borders
- **Accent**: `#C6F36B` (Acid Lime) for verified statuses and primary calls-to-action
- **Alert Colors**: `#D94F4F` (Critical Poisoning), `#D9A441` (Suspicious Similarity), `#398B60` (Safe/Verified)
- **Typography**: `Space Grotesk` (Headings), `Inter` (Body), `IBM Plex Mono` (Addresses, Hashes, Proofs)
- **Shadows**: Hard, crisp `3px 3px 0px #171717` offset shadows.

---

## Documentation

Full architectural specifications and development guides are located in [`docs/`](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs):
- [Architecture Blueprint](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/architecture.md)
- [Technology Decisions & Rationale](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/tech-decisions.md)
- [Module Responsibilities & Boundaries](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/module-responsibilities.md)
- [Dependencies Specification](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/dependencies.md)
- [Development Checklist](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/checklist.md)
- [Development Roadmap](file:///c:/Users/Baqir/OneDrive%20-%20somaiya.edu/Documents/ETHGlobal/docs/roadmap.md)

---

## Getting Started

1. Clone the repository and navigate to the project root:
   ```bash
   cd ETHGlobal
   ```
2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development services:
   ```bash
   # Launch API
   npm run dev:api
   # Launch Web App
   npm run dev:web
   # Launch Explorer
   npm run dev:explorer
   ```

---

## Security & Ethics Rule
- Never display fake or fabricated transactions as real data.
- Any mock or simulation data must be explicitly flagged as `[DEMO DATA]`.
- All authorization checks are strictly validated server-side.
- Private keys and administrative secrets must never be committed or exposed to client bundles.

