import { EvaluationResult, DecodedTransaction, SupportedLanguage } from "../types";
import { TRANSLATIONS } from "../i18n/translations";

let currentLang: SupportedLanguage = "en";
let activeData: { evaluation: EvaluationResult; decoded: DecodedTransaction } | null = null;

function renderUI() {
  if (!activeData) return;
  const t = TRANSLATIONS[currentLang];
  const { evaluation, decoded } = activeData;

  // Header
  const titleEl = document.getElementById("txt-app-title");
  if (titleEl) titleEl.innerText = t.appName.toUpperCase();

  // Status card
  const statusCard = document.getElementById("status-card");
  const statusBadge = document.getElementById("status-badge");
  const statusDesc = document.getElementById("status-desc");

  if (statusCard && statusBadge && statusDesc) {
    statusBadge.innerText = t.statusBadge[evaluation.state];
    statusDesc.innerText = t.statusDescription[evaluation.state];

    statusBadge.className = "status-badge";
    if (evaluation.state === "SUSPICIOUS_LOOKALIKE") {
      statusBadge.classList.add("status-LOOKALIKE");
      statusCard.style.borderColor = "#D94F4F";
    } else if (evaluation.state === "APPROVED_PAYEE") {
      statusBadge.classList.add("status-APPROVED");
      statusCard.style.borderColor = "#2E7D52";
    } else if (evaluation.state === "NO_MATCHING_EVIDENCE") {
      statusBadge.classList.add("status-NO_EVIDENCE");
      statusCard.style.borderColor = "#151515";
    } else {
      statusBadge.classList.add("status-UNSUPPORTED");
      statusCard.style.borderColor = "#D97706";
    }
  }

  // Recipient address display
  const lblIntended = document.getElementById("lbl-intended");
  if (lblIntended) lblIntended.innerText = t.intendedRecipient;

  const recipientEl = document.getElementById("recipient-addr");
  if (recipientEl) {
    if (evaluation.matchingPrefix && evaluation.matchingSuffix) {
      const pLen = evaluation.matchingPrefix.length;
      const sLen = evaluation.matchingSuffix.length;
      const mid = evaluation.recipient.slice(pLen, evaluation.recipient.length - sLen);
      recipientEl.innerHTML = `
        <span class="hl-match">${evaluation.recipient.slice(0, pLen)}</span><span class="hl-diff">${mid}</span><span class="hl-match">${evaluation.recipient.slice(evaluation.recipient.length - sLen)}</span>
      `;
    } else {
      recipientEl.innerText = evaluation.recipient;
    }
  }

  // Transfer meta
  const metaEl = document.getElementById("transfer-meta");
  if (metaEl) {
    metaEl.innerHTML = `
      <span class="chip">${t.token}: ${decoded.tokenSymbol || "ETH"}</span>
      <span class="chip">${t.amount}: ${decoded.amount || "0 ETH"}</span>
      <span class="chip">Safe: Sepolia</span>
    `;
  }

  // Genuine comparison card
  const genuineCard = document.getElementById("genuine-card");
  const genuineAddrEl = document.getElementById("genuine-addr");
  const anatomyEl = document.getElementById("collision-anatomy");
  const lblGenuine = document.getElementById("lbl-genuine");

  if (lblGenuine) lblGenuine.innerText = t.genuinePayee;

  if (evaluation.state === "SUSPICIOUS_LOOKALIKE" && evaluation.genuinePayee) {
    if (genuineCard) genuineCard.style.display = "block";
    if (genuineAddrEl) {
      const pLen = (evaluation.matchingPrefix || "").length;
      const sLen = (evaluation.matchingSuffix || "").length;
      const mid = evaluation.genuinePayee.slice(pLen, evaluation.genuinePayee.length - sLen);
      genuineAddrEl.innerHTML = `
        <span class="hl-match">${evaluation.genuinePayee.slice(0, pLen)}</span><span>${mid}</span><span class="hl-match">${evaluation.genuinePayee.slice(evaluation.genuinePayee.length - sLen)}</span>
      `;
    }
    if (anatomyEl) {
      anatomyEl.innerHTML = `
        <span class="chip" style="background: #C6F36B; color: #151515;">Prefix Match: ${evaluation.matchingPrefix}</span>
        <span class="chip" style="background: #C6F36B; color: #151515;">Suffix Match: ${evaluation.matchingSuffix}</span>
        <span class="chip" style="color: #D94F4F;">Mismatched Center: ${evaluation.divergentCharacters || 28} chars</span>
        <span class="chip" style="background: #151515; color: #FAF9F6;">Entropy: ${evaluation.collisionEntropy || "16^-(8)"}</span>
      `;
    }
  } else {
    if (genuineCard) genuineCard.style.display = "none";
  }

  // Privacy text
  const privacyEl = document.getElementById("txt-privacy");
  if (privacyEl) privacyEl.innerText = t.privacyDisclaimer;

  // Action buttons
  const btnAbort = document.getElementById("btn-abort");
  if (btnAbort) btnAbort.innerText = t.abortButton;

  const btnProceed = document.getElementById("btn-proceed");
  if (btnProceed) btnProceed.innerText = t.proceedButton;
}

// Initialize listeners
document.addEventListener("DOMContentLoaded", () => {
  // Lang selector
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement;
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      currentLang = (e.target as HTMLSelectElement).value as SupportedLanguage;
      renderUI();
    });
  }

  // Abort button
  const btnAbort = document.getElementById("btn-abort");
  if (btnAbort) {
    btnAbort.addEventListener("click", () => {
      window.close();
    });
  }

  // Proceed button
  const btnProceed = document.getElementById("btn-proceed");
  if (btnProceed) {
    btnProceed.addEventListener("click", () => {
      window.close();
    });
  }

  // Load active evaluation from storage
  chrome.storage.local.get("hexfence_active_evaluation", (res) => {
    if (res && res.hexfence_active_evaluation) {
      activeData = res.hexfence_active_evaluation;
      renderUI();
    }
  });
});

