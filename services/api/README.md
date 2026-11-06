# HexFence Core Threat Intelligence API (`@hexfence/api`)

Enterprise-grade backend API service for detecting, indexing, triaging, and mitigating Ethereum address-poisoning attacks. Integrates with the **Arkiv Decentralized Evidence Protocol**, powers the **Chrome Extension**, and serves threat intelligence to the **HexFence Web Explorer**.

---

## 1. Quick Start

### Start in Development Mode
```bash
# From repository root
npm run dev:api

# Or directly in services/api
cd services/api
npm run dev
```

The server boots at **`http://localhost:4000`**.

### Verify Service Health
```bash
curl http://localhost:4000/api/health
```

---

## 2. Environment Configuration

Configuration is managed via `.env` and strongly typed with Zod in `src/config/env.ts`:

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `number` | `4000` | HTTP port on which the Express server listens |
| `NODE_ENV` | `enum` | `development` | Environment mode (`development` \| `test` \| `production`) |
| `DATABASE_URL` | `string` | `file:./data/hexfence.db.json` | Persistent database storage path or connection string |
| `CORS_ORIGIN` | `string` | `*` | Allowed CORS origins (comma-separated or wildcard) |
| `LOG_LEVEL` | `enum` | `info` | Logging verbosity (`debug` \| `info` \| `warn` \| `error`) |
| `DEV_ADMIN_TOKEN` | `string` | `hexfence-dev-admin-secret-key-2026` | Token for dev-only administrative endpoint testing |
| `ARKIV_GATEWAY_URL` | `string` | `https://gateway.arkiv.network/v1` | Arkiv decentralized protocol gateway endpoint |

---

## 3. Data Models Specification

### 3.1 `CommunityReport`
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique report identifier (e.g. `REP-1001`) |
| `submittedAddress` | `string` | Yes | Target Ethereum wallet or lookalike under report (42-char hex) |
| `relatedAddress` | `string` | No | Genuine reference counterparty being mimicked |
| `txHash` | `string` | No | Triggering dust/zero-value transaction hash |
| `tokenContract` | `string` | No | Targeted asset symbol or contract address (e.g. `USDT`, `WBTC`) |
| `description` | `string` | Yes | Description of suspicious transfer (min 10 chars) |
| `supportingEvidence`| `string` | No | Etherscan link or forensic notes |
| `submissionTimestamp`| `string`| Yes | ISO 8601 creation timestamp |
| `reviewStatus` | `enum` | Yes | `PENDING` \| `UNDER_REVIEW` \| `CONFIRMED` \| `REJECTED` \| `FALSE_POSITIVE` |
| `isFalsePositiveDispute`| `boolean`| No | Flagged when submitted as a dispute |

### 3.2 `ThreatEvidence`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique evidence identifier (e.g. `EVID-0001`) |
| `suspectedAddress` | `string` | Mined lookalike poisoner address |
| `referenceAddress` | `string` | Legitimate reference counterparty |
| `txHash` | `string` | Triggering on-chain transaction hash |
| `tokenContract` | `string` | Asset manipulated (e.g. `WBTC`, `USDC`) |
| `detectionReason` | `enum` | `DUST_TRANSFER` \| `ZERO_VALUE_TRANSFER` \| `GPU_VANITY_COLLISION` \| `HIGH_HAMMING_SIMILARITY` |
| `confidenceScore` | `number` | Heuristic confidence metric (0–100) |
| `detectorVersion` | `string` | Engine release version (e.g. `v2.4.2-heuristic`) |
| `timestamp` | `string` | Incident detection timestamp (ISO 8601) |
| `evidenceStatus` | `enum` | `SUSPECTED` \| `UNDER_REVIEW` \| `CONFIRMED_BY_REVIEW` \| `FALSE_POSITIVE` |
| `arkivEntityReference` | `string` | Cryptographic Arkiv URI receipt (e.g. `arkiv://hexfence-evidence/proof_0x...`) |
| `sharedPrefix` / `sharedSuffix` | `string` | Matched vanity characters on address boundaries |
| `divergentLength` | `number` | Count of mismatched characters in address middle |

### 3.3 `AuditLog`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique event identifier (e.g. `EVT-1001`) |
| `action` | `string` | Action performed (e.g. `ADDRESS_INVESTIGATED`, `COMMUNITY_REPORT_SUBMITTED`) |
| `actorReference` | `string` | Originating actor (e.g. `dev-admin`, `community-reporter`) |
| `timestamp` | `string` | ISO 8601 timestamp |
| `relevantMetadata` | `object` | Action-specific context payload |
| `status` | `enum` | `SUCCESS` \| `FAILED` \| `WARNING` |

### 3.4 `NotificationPreference`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Preference ID |
| `userReference` | `string` | Wallet address or user identifier |
| `notificationType`| `enum` | `EMAIL` \| `IVR_PHONE` \| `BROWSER_PUSH` \| `WEBHOOK` |
| `enabled` | `boolean` | Alert channel activation status |
| `destination` | `string` | Destination address (email, phone, webhook URL) |

---

## 4. API Endpoints Reference

### 4.1 Address Investigation
- **`GET /api/investigate?address=0x...`** or **`GET /api/investigate/:address`**
  - **Description**: Evaluates address against known attack clusters and community records.
  - **Example**:
    ```bash
    curl "http://localhost:4000/api/investigate?address=0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91"
    ```
  - **Sample Response**:
    ```json
    {
      "success": true,
      "data": {
        "address": "0xd9A1C3C6f3590059B2E3516A6ea0ADa244853a91",
        "isFormatValid": true,
        "status": "AUDIT_COMPLETED",
        "hasMatchingEvidence": true,
        "totalAssociatedLookalikes": 1,
        "evidenceList": [...],
        "associatedReports": [...],
        "disclaimer": "CRITICAL NOTICE: The absence of indexed threat evidence does NOT guarantee that an address is safe..."
      }
    }
    ```

### 4.2 Evidence Retrieval
- **`GET /api/evidence`**
  - **Filters**: `status`, `token`, `reason`, `limit`, `offset`
  - **Example**:
    ```bash
    curl "http://localhost:4000/api/evidence?status=CONFIRMED_BY_REVIEW&token=WBTC"
    ```
- **`GET /api/evidence/:id`**
  - **Example**:
    ```bash
    curl "http://localhost:4000/api/evidence/EVID-0001"
    ```

### 4.3 Community Reporting
- **`POST /api/reports`**
  - **Example**:
    ```bash
    curl -X POST http://localhost:4000/api/reports \
      -H "Content-Type: application/json" \
      -d '{
        "submittedAddress": "0x71C412a83158c35B4EbA692998982312d288976F",
        "relatedAddress": "0x71C409fE06718E3c1A488c03F05C334d7288976F",
        "tokenContract": "USDT",
        "description": "Zero-value USDT transfer appeared in recent activity feed from spoofed lookalike address."
      }'
    ```
- **`POST /api/reports/false-positive`**
  - **Example**:
    ```bash
    curl -X POST http://localhost:4000/api/reports/false-positive \
      -H "Content-Type: application/json" \
      -d '{
        "address": "0x1111111254fb6c44bac0bed2854e76f90643097d",
        "reason": "Legitimate decentralized router contract (1inch v5) false-flagged due to vanity leading bytes.",
        "contactEmail": "devs@1inch.io"
      }'
    ```

### 4.4 Administrative Review (Development-Only Access)
> [!IMPORTANT]
> Administrative write endpoints require the header `x-hexfence-dev-admin: true` or `Authorization: Bearer <DEV_ADMIN_TOKEN>`. Unrestricted write access is strictly blocked when `NODE_ENV === "production"`.

- **`GET /api/admin/evidence`**
  ```bash
  curl http://localhost:4000/api/admin/evidence \
    -H "x-hexfence-dev-admin: true"
  ```
- **`PATCH /api/admin/evidence/:id`**
  ```bash
  curl -X PATCH http://localhost:4000/api/admin/evidence/EVID-0003 \
    -H "Content-Type: application/json" \
    -H "x-hexfence-dev-admin: true" \
    -d '{
      "status": "CONFIRMED_BY_REVIEW",
      "reviewNotes": "Analyst verified GPU cluster origin on Etherscan transaction trace."
    }'
  ```
- **`GET /api/admin/audit-logs`**
  ```bash
  curl http://localhost:4000/api/admin/audit-logs \
    -H "x-hexfence-dev-admin: true"
  ```

---

## 5. Standard Error Format

All error responses strictly adhere to RFC 7807 structured JSON format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed on one or more fields.",
    "location": "body",
    "details": [
      {
        "field": "submittedAddress",
        "message": "Invalid Ethereum address. Must be a 42-character string starting with '0x'.",
        "rule": "invalid_string"
      }
    ]
  },
  "timestamp": "2026-11-06T00:00:00.000Z",
  "requestId": "req_8f1a09bc"
}
```

