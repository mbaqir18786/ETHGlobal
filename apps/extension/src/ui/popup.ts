import { ApprovedPayee, SupportedLanguage } from "../types";
import { TRANSLATIONS } from "../i18n/translations";
import { getLocalApprovedPayees, saveApprovedPayees } from "../engine/comparator";
import { getLocalArkivSnapshot } from "../engine/snapshot";

let currentLang: SupportedLanguage = "en";
let payees: ApprovedPayee[] = [];

async function initPopup() {
  // Load snapshot count
  const snapshot = await getLocalArkivSnapshot();
  const countEl = document.getElementById("entity-count");
  if (countEl) {
    countEl.innerText = `${snapshot.totalEntities} Threat Records`;
  }

  // Load payees
  payees = await getLocalApprovedPayees();
  renderPayees();

  // Bind presets
  const simInput = document.getElementById("sim-address") as HTMLInputElement;

  document.getElementById("btn-preset-lookalike")?.addEventListener("click", () => {
    if (simInput) simInput.value = "0xd9a1c3c6f3590059b2e3516a6ea0ada244853a91";
  });

  document.getElementById("btn-preset-approved")?.addEventListener("click", () => {
    if (simInput) simInput.value = "0xd9a1c3788d81257612e2581a6ea0ada244853a91";
  });

  document.getElementById("btn-preset-unknown")?.addEventListener("click", () => {
    if (simInput) simInput.value = "0x1111111254fb6c44bac0bed2854e76f90643097d";
  });

  // Simulate button
  document.getElementById("btn-simulate")?.addEventListener("click", () => {
    const address = (simInput?.value || "").trim();
    if (!address) return;

    chrome.runtime.sendMessage({
      type: "TRANSACTION_PREPARED",
      payload: {
        to: address,
        value: "0",
        data: "0x",
      },
    });
  });

  // Sync snapshot
  document.getElementById("btn-sync-snapshot")?.addEventListener("click", () => {
    const statusEl = document.getElementById("snapshot-status");
    if (statusEl) statusEl.innerText = "SYNCING...";

    chrome.runtime.sendMessage({ type: "SYNC_SNAPSHOT" }, (res) => {
      if (statusEl) statusEl.innerText = "SYNCED";
      if (countEl && res?.total) countEl.innerText = `${res.total} Threat Records`;
    });
  });

  // Add payee
  document.getElementById("btn-add-payee")?.addEventListener("click", async () => {
    const addrInput = document.getElementById("new-payee-addr") as HTMLInputElement;
    const labelInput = document.getElementById("new-payee-label") as HTMLInputElement;

    const address = (addrInput?.value || "").trim().toLowerCase();
    const label = (labelInput?.value || "Approved Payee").trim();

    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      payees.push({
        address,
        label,
        addedAt: new Date().toISOString(),
      });
      await saveApprovedPayees(payees);
      renderPayees();
      if (addrInput) addrInput.value = "";
      if (labelInput) labelInput.value = "";
    }
  });

  // Lang switcher
  const langSelect = document.getElementById("popup-lang-select") as HTMLSelectElement;
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      currentLang = (e.target as HTMLSelectElement).value as SupportedLanguage;
      updateText();
    });
  }
}

function renderPayees() {
  const listEl = document.getElementById("payees-list");
  const countEl = document.getElementById("payee-count");

  if (countEl) countEl.innerText = `${payees.length} Payees`;
  if (!listEl) return;

  listEl.innerHTML = "";
  payees.forEach((payee, idx) => {
    const item = document.createElement("div");
    item.className = "payee-item";
    item.innerHTML = `
      <div>
        <strong>${payee.label}</strong>
        <div style="font-size: 9px; color: #666;">${payee.address.slice(0, 8)}...${payee.address.slice(-6)}</div>
      </div>
      <span class="del-btn" data-index="${idx}">✖</span>
    `;
    listEl.appendChild(item);
  });

  // Bind deletes
  listEl.querySelectorAll(".del-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idx = parseInt((e.target as HTMLElement).dataset.index || "0", 10);
      payees.splice(idx, 1);
      await saveApprovedPayees(payees);
      renderPayees();
    });
  });
}

function updateText() {
  const t = TRANSLATIONS[currentLang];
  const simBtn = document.getElementById("btn-simulate");
  if (simBtn) simBtn.innerText = t.simulateCheck;

  const snapTitle = document.getElementById("txt-snapshot-title");
  if (snapTitle) snapTitle.innerText = t.snapshotInfo.toUpperCase();

  const payTitle = document.getElementById("txt-payees-title");
  if (payTitle) payTitle.innerText = t.managePayees.toUpperCase();
}

document.addEventListener("DOMContentLoaded", initPopup);

