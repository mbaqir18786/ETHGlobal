# HexFence Technology Decisions & Rationale

This document details the architectural choices, framework selections, and design tradeoffs made for the HexFence platform.

---

## 1. Monorepo Architecture: npm Workspaces
- **Decision**: Native `npm workspaces` within Node.js 26 / npm 11.
- **Why**: Native support without requiring third-party tools that may have environment/sandbox constraints. Provides clean logical isolation (`apps/*`, `services/*`, `packages/*`) while allowing zero-latency code sharing (`@hexfence/shared`).
- **Alternatives Considered**: Turborepo, Nx, Lerna.
- **Tradeoff**: Simpler setup with zero external CLI overhead, preserving cross-platform stability on Windows.

---

## 2. Language: TypeScript Across All Layers
- **Decision**: TypeScript (Strict Mode) across frontend, backend, extension, and scripts.
- **Why**: Address-poisoning detection operates on strict hexadecimal invariants, signature formats, and Ethereum address checksums (EIP-55). Static type guarantees eliminate whole classes of string manipulation errors.
- **Configuration**: Shared `tsconfig.base.json` extended by each workspace package.

---

## 3. Web Framework: Next.js 14+ (App Router) & React 18
- **Decision**: Next.js 14+ with App Router for `apps/web` and `apps/explorer`.
- **Why**:
  - Server Components allow secure rendering of Arkiv evidence receipts and metadata caching without exposing sensitive backend tokens.
  - Built-in API route options and SEO rendering for public address investigation.
  - Native integration with modern Web3 libraries (Viem/Wagmi).

---

## 4. Design System: Refined Neo-Brutalism with Tailwind CSS
- **Decision**: Tailwind CSS configured with custom HexFence design tokens (`#F4F2EC`, `#171717`, `#C6F36B`, `#D94F4F`, `#D9A441`, `#398B60`).
- **Why**:
  - Cybersecurity tools suffer from generic SaaS fatigue or illegible dark cyberpunk themes.
  - Refined Neo-Brutalism provides extreme contrast, crisp 2px geometric borders, clear visual states, and unmistakable visual warnings.
  - Monospace font (`IBM Plex Mono`) ensures exact character-by-character visual comparison of 42-character Ethereum addresses.

---

## 5. Backend Framework: Fastify / Express (TypeScript)
- **Decision**: Node.js REST API with Fastify/Express.
- **Why**:
  - Low latency for high-throughput address check queries initiated by the browser extension and web portal.
  - Comprehensive middleware ecosystem for JWT, CORS, rate-limiting, and validation schemas (Zod).

---

## 6. Database & ORM: Prisma ORM with SQLite / PostgreSQL
- **Decision**: Prisma ORM with SQLite for local zero-dependency development, swappable to PostgreSQL for production deployments.
- **Why**:
  - Declarative schema migrations.
  - Type-safe database queries mapped directly to shared TypeScript interfaces.
  - Seamless local setup without requiring a running Docker or cloud PostgreSQL instance during initial phases.

---

## 7. Smart Contracts: Solidity 0.8.24 & Hardhat
- **Decision**: Solidity 0.8.24 targeting Gnosis Safe contract guards (`BaseGuard`).
- **Why**:
  - Gnosis Safe is the gold standard for institutional and high-net-worth Ethereum treasury management (the primary targets of vanity address poisoning).
  - Hardhat provides a reliable test harness with local EVM simulation and EIP-712 signature verification tooling.

---

## 8. Decentralized Evidence: Arkiv Protocol
- **Decision**: Standardized JSON-LD evidence proofs anchored via Arkiv decentralized storage protocol.
- **Why**:
  - Traditional security blacklists are centralized and vulnerable to censorship or private modification.
  - Arkiv provides immutable, public timestamping and cryptographic proofs, ensuring community verifiability of detected attack clusters.

---

## 9. Client Defense: Chrome Manifest V3 Browser Extension
- **Decision**: Manifest V3 compliant extension written in TypeScript with Service Workers.
- **Why**:
  - Manifest V3 is the modern Google Chrome standard.
  - Service Workers allow background communication with the HexFence API while content scripts run lightweight, zero-latency DOM heuristics directly inside dApps.

