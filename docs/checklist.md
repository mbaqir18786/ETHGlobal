# HexFence Development Checklist

This master checklist tracks implementation verification across all phases. Every item must be rigorously tested before marking complete.

---

## Phase 0: Project Inspection & Architecture
- [x] Inspect existing workspace directory (confirmed clean slate).
- [x] Check Node.js, npm, and toolchain versions (Node v26.7.0, npm 11.16.0, Git 2.49.0).
- [x] Formulate monorepo structure (`apps/`, `services/`, `packages/`, `docs/`).
- [x] Author comprehensive project `README.md`.
- [x] Author system architecture document (`docs/architecture.md`).
- [x] Author technology rationale document (`docs/tech-decisions.md`).
- [x] Author module responsibility matrix (`docs/module-responsibilities.md`).
- [x] Author dependency list (`docs/dependencies.md`).
- [x] Create `.env.example` template covering all services and keys.
- [x] Author development roadmap (`docs/roadmap.md`).
- [x] Author development checklist (`docs/checklist.md`).
- [ ] Initialize base folder structure and package manifests.

---

## Phase 1: Website Foundation & Design System (Frontend Core)
- [x] Configure Refined Neo-Brutalist design tokens (`#F4F2EC`, `#151515`, `#C6F36B`, `#6B8CFF`, `#D94F4F`).
- [x] Integrate Space Grotesk, Inter, and IBM Plex Mono typography.
- [x] Build responsive Navigation Bar (`apps/web/components/Navbar.tsx`) with brand logo, links, Login CTA, and Get Extension action.
- [x] Build Footer (`apps/web/components/Footer.tsx`) with brand summary, quick links, architecture references, and disclaimer.
- [x] Build interactive Address Collision Comparator (`apps/web/components/AddressDiffViewer.tsx`).
- [x] Build Interactive System Architecture visualization (`apps/web/components/ArchitectureDiagram.tsx`).
- [x] Build complete Homepage (`/`) with Hero, Problem, 4 Pillars, Key Features, Architecture, and Final CTA sections.
- [x] Build Address Threat Explorer route (`/explorer`) with filterable demo attack vectors and Arkiv audit receipt inspector.
- [x] Build Detailed Mechanics route (`/how-it-works`) breaking down entropy mathematics, dust transfers, Arkiv proofs, and Safe Guard.
- [x] Build Technical Documentation route (`/docs`) with interactive section browser and code snippets.
- [x] Build Role-based Login Placeholder route (`/login`) with role preview simulations (`USER`, `ADMIN`, `SUPER_ADMIN`).

---

## Phase 2: Public Address Explorer (Threat Intelligence Interface)
- [x] Build Ethereum address format validator with explicit error states (`apps/web/lib/mock-evidence.ts`).
- [x] Create structured mock evidence registry prepared for Arkiv decentralized proofs (`apps/web/lib/mock-evidence.ts`).
- [x] Build Address Relationship Visualizer (`apps/web/components/AddressRelationshipVisualizer.tsx`) with prefix/suffix vanity collision highlights.
- [x] Build Evidence Timeline (`apps/web/components/EvidenceTimeline.tsx`) with detection timestamps, tx hashes, Arkiv proof IDs, and detector versions.
- [x] Implement standardized Evidence Status badges: `Suspected`, `Under Review`, `Confirmed by Review`, `False Positive`.
- [x] Implement multi-parameter filters (Token: USDT/USDC/WBTC, Evidence Status, Detection Reason, Date Range).
- [x] Implement honest, non-fabricated empty state: "No matching threat evidence found in the currently available dataset" (with zero fake green confirmations).
- [x] Build interactive search interface with quick sample selectors at `/explorer`.

---

## Phase 3: Platform Interfaces & Development Dashboards
- [x] Build Threat Intelligence Macro Overview page (`apps/web/app/threat-intel/page.tsx`).
- [x] Build User Dashboard (`apps/web/app/dashboard/page.tsx`) with Overview, Submitted Reports, Threat Reporting, False-Positive Disputes, Monitored Safes, and Notification Settings.
- [x] Build Admin Portal (`apps/web/app/admin/page.tsx`) with Review Queue, Evidence Dossiers, False-Positive Dispute Resolution, and Administrative Audit Trail.
- [x] Build Super Admin Control Center (`apps/web/app/super-admin/page.tsx`) with Admin Management, RBAC Matrix, Heuristic/Arkiv Config, Security API Keys, and Emergency Circuit Breaker.
- [x] Build Development Role Switcher bar (`apps/web/components/DevRoleSwitcher.tsx`) enabling zero-auth instant interface switching between Public, User, Admin, and Super Admin.
- [x] Preserve all Phase 3 restrictions (No mock authentication, no route guards, no fake security assertions).

---

## Phase 4: Solidity Smart Contracts & Safe Guard (`packages/contracts`)
- [ ] Implement `HexFenceGuard.sol` implementing Gnosis Safe `BaseGuard`.
- [ ] Implement `checkTransaction()` logic checking target against blacklist registry.
- [ ] Implement `checkAfterExecution()` telemetry hook.
- [ ] Implement administrative functions with multi-sig protection.
- [ ] Write Hardhat test suite simulating real Safe transaction interception.
- [ ] Verify 100% test pass on Hardhat network.

---

## Phase 5: Backend API & Database with RBAC (`services/api`)
- [ ] Initialize Prisma schema (User, Session, MonitoredWallet, Incident, SafeGuard).
- [ ] Setup SQLite local database migrations.
- [ ] Implement JWT authentication with password hashing (bcrypt).
- [ ] Implement RBAC middleware (`USER`, `ADMIN`, `SUPER_ADMIN`).
- [ ] Expose RESTful endpoints:
  - [ ] `POST /api/auth/register` & `POST /api/auth/login`
  - [ ] `POST /api/check-address` (risk check)
  - [ ] `GET /api/incidents` & `GET /api/incidents/:id`
  - [ ] `POST /api/incidents` (report/anchor)
  - [ ] `GET /api/safes` & `POST /api/safes/register`
- [ ] Write integration tests for API endpoints.

---

## Phase 6: Web Management Portal & Explorer (`apps/web` & `apps/explorer`)
- [ ] Configure Tailwind with Refined Neo-Brutalist tokens (`#F4F2EC`, `#171717`, `#C6F36B`).
- [ ] Implement atomic UI components:
  - [ ] `NeoButton`, `NeoCard`, `NeoBadge`, `AddressDiffViewer`, `RiskScoreMeter`.
- [ ] Build Address Inspector with interactive character collision highlighting.
- [ ] Build Arkiv Evidence Explorer (`apps/explorer`) with verified cryptographic proofs.
- [ ] Build Safe Guard deployment & verification wizard (`apps/web`).
- [ ] Build Admin and Super Admin incident management portal.

---

## Phase 7: Manifest V3 Browser Extension (`apps/extension`)
- [ ] Setup Manifest V3 configuration (`manifest.json`).
- [ ] Implement background service worker for API communication.
- [ ] Implement content script detecting address paste and form input interactions.
- [ ] Build Neo-Brutalist warning modal rendering exact mismatched characters.
- [ ] Build popup UI with address fast-check and recent alerts.

---

## Phase 8: End-to-End Integration, Auditing & Final Verification
- [ ] Execute complete attack simulation flow:
  - [ ] Simulated dust transfer generated.
  - [ ] Detection engine flags vanity collision.
  - [ ] Extension displays warning banner before user signs.
  - [ ] Arkiv proof anchored and visible in Explorer.
  - [ ] Safe Guard blocks malicious transaction execution on-chain.
- [ ] Validate zero fabricated data or hardcoded mock masks.
- [ ] Final security review of environment configs and dependencies.

