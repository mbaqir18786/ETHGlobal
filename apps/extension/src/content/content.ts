/**
 * HexFence Safe Guard Content Script
 * Injected into app.safe.global on Sepolia / Ethereum Mainnet
 */

console.log("🛡️ HexFence Safe Guard active on app.safe.global");

// Track last evaluated recipient to avoid spamming
let lastEvaluatedRecipient: string = "";

/**
 * Creates a subtle floating security badge on Safe web interface
 */
function injectHexFenceShieldBadge() {
  if (document.getElementById("hexfence-shield-indicator")) return;

  const badge = document.createElement("div");
  badge.id = "hexfence-shield-indicator";
  badge.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      background: #151515;
      color: #F4F2EC;
      border: 2px solid #C6F36B;
      padding: 8px 14px;
      font-family: monospace;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 3px 3px 0px #151515;
      cursor: pointer;
    ">
      <span style="color: #C6F36B; font-size: 14px;">🛡️</span>
      <span>HEXFENCE GUARD: LOCAL PRIVACY DEFENSE ACTIVE</span>
    </div>
  `;

  badge.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "TRANSACTION_PREPARED",
      payload: {
        to: lastEvaluatedRecipient || "0xd9a1c3c6f3590059b2e3516a6ea0ada244853a91",
        value: "0",
        data: "0x",
      },
    });
  });

  document.body.appendChild(badge);
}

/**
 * Scans the DOM for recipient input elements in Safe modals
 */
function scanSafeRecipientInputs() {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[name*="recipient"], input[placeholder*="0x"], input[placeholder*="recipient"], input[id*="recipient"]'
  );

  inputs.forEach((input) => {
    if (input.dataset.hexfenceHooked) return;
    input.dataset.hexfenceHooked = "true";

    const evaluateCurrentInput = () => {
      const val = (input.value || "").trim();
      if (/^0x[a-fA-F0-9]{40}$/.test(val) && val.toLowerCase() !== lastEvaluatedRecipient.toLowerCase()) {
        lastEvaluatedRecipient = val;
        console.log("🔍 HexFence Intercepted Proposed Safe Recipient:", val);

        // Notify background worker to analyze transaction and spawn warning dialog
        chrome.runtime.sendMessage({
          type: "TRANSACTION_PREPARED",
          payload: {
            to: val,
            value: "0",
            data: "0x",
          },
        });
      }
    };

    input.addEventListener("input", evaluateCurrentInput);
    input.addEventListener("change", evaluateCurrentInput);
    input.addEventListener("paste", () => setTimeout(evaluateCurrentInput, 100));
  });
}

// Initial check and periodic DOM observer for dynamically rendered Safe modals
window.addEventListener("load", () => {
  injectHexFenceShieldBadge();
  scanSafeRecipientInputs();
});

const observer = new MutationObserver(() => {
  injectHexFenceShieldBadge();
  scanSafeRecipientInputs();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

