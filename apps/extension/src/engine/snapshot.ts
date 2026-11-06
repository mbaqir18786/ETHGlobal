import { ArkivSnapshot, ArkivSnapshotEntity } from "../types";

const SNAPSHOT_STORAGE_KEY = "hexfence_arkiv_snapshot";

// Built-in initial snapshot records (cached on install for instant offline operation)
export const SEED_ARKIV_ENTITIES: ArkivSnapshotEntity[] = [
  {
    evidenceId: "EVID-9812",
    referenceAddress: "0xd9a1c3788d81257612e2581a6ea0ada244853a91",
    suspectedAddress: "0xd9a1c3c6f3590059b2e3516a6ea0ada244853a91",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    token: "WBTC",
    confidence: 99.4,
    evidenceStatus: "confirmed",
    sharedPrefix: "0xd9a1",
    sharedSuffix: "3a91",
  },
  {
    evidenceId: "EVID-7421",
    referenceAddress: "0x28c6c06298d514db089934071355e5743bf21d60",
    suspectedAddress: "0x28c6c06283748281928392817283948271bf21d60",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    token: "USDT",
    confidence: 97.8,
    evidenceStatus: "confirmed",
    sharedPrefix: "0x28c6c062",
    sharedSuffix: "bf21d60",
  },
  {
    evidenceId: "EVID-6510",
    referenceAddress: "0xa090e606e30bd747d4e6245a1517ebe430f0057e",
    suspectedAddress: "0xa090e606e30b1293810293810293810293f0057e",
    txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    token: "USDC",
    confidence: 96.2,
    evidenceStatus: "suspected",
    sharedPrefix: "0xa090e606",
    sharedSuffix: "f0057e",
  },
];

/**
 * Loads the current Arkiv snapshot from chrome.storage.local or falls back to seeds
 */
export async function getLocalArkivSnapshot(): Promise<ArkivSnapshot> {
  try {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(SNAPSHOT_STORAGE_KEY);
      if (result && result[SNAPSHOT_STORAGE_KEY]) {
        return result[SNAPSHOT_STORAGE_KEY] as ArkivSnapshot;
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to load snapshot from chrome.storage, using in-memory defaults:", err);
  }

  // Return baseline snapshot
  return {
    version: "1.0.0",
    downloadedAt: new Date().toISOString(),
    totalEntities: SEED_ARKIV_ENTITIES.length,
    entities: SEED_ARKIV_ENTITIES,
  };
}

/**
 * Saves a new bulk snapshot into chrome.storage.local
 */
export async function saveArkivSnapshot(snapshot: ArkivSnapshot): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [SNAPSHOT_STORAGE_KEY]: snapshot });
  }
}

/**
 * Downloads a fresh bulk snapshot from Arkiv API without leaking individual recipients
 */
export async function downloadBulkArkivSnapshot(apiUrl: string = "http://localhost:4000/api"): Promise<ArkivSnapshot> {
  try {
    const res = await fetch(`${apiUrl}/evidence/arkiv/recent?limit=500`, {
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const entities: ArkivSnapshotEntity[] = json.data.map((item: any) => ({
          evidenceId: item.evidenceId || `EVID-${item.$key || Date.now()}`,
          referenceAddress: (item.referenceAddress || "").toLowerCase(),
          suspectedAddress: (item.suspectedAddress || "").toLowerCase(),
          txHash: item.txHash || "",
          token: item.token || "UNKNOWN",
          confidence: parseFloat(item.confidence || "95.0"),
          evidenceStatus: item.evidenceStatus || "suspected",
          sharedPrefix: (item.referenceAddress || "").slice(0, 6),
          sharedSuffix: (item.referenceAddress || "").slice(-4),
        }));

        const newSnapshot: ArkivSnapshot = {
          version: `snapshot-${Date.now()}`,
          downloadedAt: new Date().toISOString(),
          totalEntities: entities.length,
          entities: [...SEED_ARKIV_ENTITIES, ...entities],
        };

        await saveArkivSnapshot(newSnapshot);
        return newSnapshot;
      }
    }
  } catch (err) {
    console.warn("⚠️ Bulk snapshot download failed, preserving existing cache:", err);
  }

  return getLocalArkivSnapshot();
}

