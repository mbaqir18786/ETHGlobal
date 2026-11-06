# HexFence Dependency Specification

This document lists the production and development dependencies required across the HexFence workspace.

---

## 1. Monorepo Root
- **Package Manager**: npm (v11+)
- **Core Workspace Tooling**:
  - `typescript` (^5.4.0)
  - `rimraf` (^5.0.0)
  - `dotenv` (^16.4.5)

---

## 2. `packages/shared`
- **Dependencies**:
  - `zod` (^3.23.8) — Runtime schema validation
- **Dev Dependencies**:
  - `typescript` (^5.4.0)

---

## 3. `packages/config`
- **Dev Dependencies**:
  - `typescript` (^5.4.0)
  - `eslint` (^8.57.0)
  - `prettier` (^3.2.5)

---

## 4. `packages/contracts`
- **Dependencies**:
  - `@openzeppelin/contracts` (^5.0.2) — Ownable, ReentrancyGuard, ERC20 mocks
  - `@gnosis.pm/safe-contracts` or `@safe-global/safe-contracts` (^1.4.1) — Gnosis Safe BaseGuard interface
- **Dev Dependencies**:
  - `hardhat` (^2.22.3)
  - `@nomicfoundation/hardhat-toolbox` (^5.0.0)
  - `ethers` (^6.12.0)
  - `typechain` (^8.3.2)

---

## 5. `services/detector`
- **Dependencies**:
  - `@hexfence/shared` (workspace:*)
  - `viem` (^2.9.20) — Lightweight, type-safe Ethereum RPC interactions
- **Dev Dependencies**:
  - `typescript` (^5.4.0)
  - `vitest` (^1.5.0) — High-speed heuristic test suite

---

## 6. `services/api`
- **Dependencies**:
  - `@hexfence/shared` (workspace:*)
  - `@hexfence/detector` (workspace:*)
  - `express` (^4.19.2) or `fastify` (^4.26.2)
  - `cors` (^2.8.5)
  - `helmet` (^7.1.0)
  - `jsonwebtoken` (^9.0.2)
  - `bcryptjs` (^2.4.3)
  - `@prisma/client` (^5.13.0)
  - `dotenv` (^16.4.5)
- **Dev Dependencies**:
  - `prisma` (^5.13.0)
  - `@types/express` (^4.17.21)
  - `@types/jsonwebtoken` (^9.0.6)
  - `@types/bcryptjs` (^2.4.6)
  - `tsx` (^4.7.2) — Fast TypeScript script executor

---

## 7. `apps/web` & `apps/explorer`
- **Dependencies**:
  - `@hexfence/shared` (workspace:*)
  - `next` (^14.2.3)
  - `react` (^18.3.1)
  - `react-dom` (^18.3.1)
  - `lucide-react` (^0.378.0) — Iconography
  - `clsx` (^2.1.1) & `tailwind-merge` (^2.3.0) — Class utility
  - `viem` (^2.9.20) & `wagmi` (^2.8.0) — Web3 wallet connection
  - `@tanstack/react-query` (^5.32.0)
- **Dev Dependencies**:
  - `tailwindcss` (^3.4.3)
  - `postcss` (^8.4.38)
  - `autoprefixer` (^10.4.19)
  - `@types/react` (^18.3.1)
  - `@types/react-dom` (^18.3.0)

---

## 8. `apps/extension`
- **Dependencies**:
  - `@hexfence/shared` (workspace:*)
- **Dev Dependencies**:
  - `typescript` (^5.4.0)
  - `@types/chrome` (^0.0.266)
  - `vite` (^5.2.10) — Build pipeline for Manifest V3 content/background bundles

