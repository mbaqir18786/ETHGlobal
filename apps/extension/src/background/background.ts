import { decodeSafeTransaction } from "../engine/decoder";
import { evaluateTransaction, getLocalApprovedPayees } from "../engine/comparator";
import { getLocalArkivSnapshot, downloadBulkArkivSnapshot } from "../engine/snapshot";

const ACTIVE_EVAL_KEY = "hexfence_active_evaluation";
let warningWindowId: number | null = null;

// Initialize extension defaults on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("🛡️ HexFence Safe Guard Extension installed.");
  // Preload local snapshot and approved payees
  await getLocalArkivSnapshot();
  await getLocalApprovedPayees();

  // Create periodic alarm for bulk snapshot refresh (every 30 mins)
  chrome.alarms.create("REFRESH_ARKIV_SNAPSHOT", { periodInMinutes: 30 });
});

// Alarm listener for periodic bulk snapshot synchronization
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "REFRESH_ARKIV_SNAPSHOT") {
    console.log("🔄 Background refresh: downloading bulk Arkiv snapshot...");
    await downloadBulkArkivSnapshot();
  }
});

// Message listener for transactions intercepted on Safe
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TRANSACTION_PREPARED") {
    handleTransactionPrepared(message.payload).then((result) => {
      sendResponse({ success: true, result });
    });
    return true; // Keep sendResponse open for async
  }

  if (message.type === "GET_ACTIVE_EVALUATION") {
    chrome.storage.local.get(ACTIVE_EVAL_KEY, (res) => {
      sendResponse({ evaluation: res[ACTIVE_EVAL_KEY] || null });
    });
    return true;
  }

  if (message.type === "SYNC_SNAPSHOT") {
    downloadBulkArkivSnapshot().then((snapshot) => {
      sendResponse({ success: true, total: snapshot.totalEntities });
    });
    return true;
  }
  return false;
});

/**
 * Handles newly prepared transaction from Safe interface
 */
async function handleTransactionPrepared(txPayload: {
  to?: string;
  value?: string;
  data?: string;
}) {
  const decoded = decodeSafeTransaction(txPayload);
  const snapshot = await getLocalArkivSnapshot();
  const payees = await getLocalApprovedPayees();

  const evaluation = await evaluateTransaction(decoded, snapshot, payees);

  // Store active evaluation for the warning window
  await chrome.storage.local.set({ [ACTIVE_EVAL_KEY]: { evaluation, decoded } });

  // Open separate security warning window
  try {
    // If a previous warning window is open, close it first
    if (warningWindowId !== null) {
      try {
        await chrome.windows.remove(warningWindowId);
      } catch {
        // Window already closed by user
      }
    }

    const window = await chrome.windows.create({
      url: chrome.runtime.getURL("warning.html"),
      type: "popup",
      width: 480,
      height: 640,
      focused: true,
    });

    warningWindowId = window.id || null;
  } catch (err) {
    console.warn("⚠️ Could not spawn standalone warning window, falling back to popup:", err);
  }

  return evaluation;
}
