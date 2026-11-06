import { SupportedLanguage, WarningState } from "../types";

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  warningTitle: string;
  statusBadge: Record<WarningState, string>;
  statusDescription: Record<WarningState, string>;
  intendedRecipient: string;
  genuinePayee: string;
  matchingAnatomy: string;
  prefix: string;
  suffix: string;
  divergent: string;
  collisionEntropy: string;
  transferDetails: string;
  token: string;
  amount: string;
  abortButton: string;
  proceedButton: string;
  privacyNotice: string;
  privacyDisclaimer: string;
  snapshotInfo: string;
  managePayees: string;
  addPayee: string;
  removePayee: string;
  testLab: string;
  simulateCheck: string;
  copyAddress: string;
  copied: string;
  noMatchingEvidenceNotice: string;
  cannotVerifyNotice: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    appName: "HexFence Security Guard",
    appSubtitle: "Safe Address-Poisoning & Vanity Spoof Defense",
    warningTitle: "TRANSACTION RECIPIENT AUDIT",
    statusBadge: {
      SUSPICIOUS_LOOKALIKE: "CRITICAL: SUSPICIOUS LOOKALIKE DETECTED",
      APPROVED_PAYEE: "SAFE: APPROVED PAYEE VERIFIED",
      NO_MATCHING_EVIDENCE: "CAUTION: NO MATCHING EVIDENCE FOUND",
      CANNOT_VERIFY: "UNVERIFIED: UNSUPPORTED TRANSACTION FORMAT",
    },
    statusDescription: {
      SUSPICIOUS_LOOKALIKE:
        "ALERT: This recipient address closely mimics an approved genuine payee with identical leading and trailing vanity characters. Do NOT copy addresses from transaction history.",
      APPROVED_PAYEE:
        "This recipient is in your explicitly verified Safe approved payees registry. It is safe to proceed.",
      NO_MATCHING_EVIDENCE:
        "This address does not match any known threat records in the local Arkiv snapshot. IMPORTANT: Absence of evidence is NOT proof of safety. Always verify all 42 characters manually.",
      CANNOT_VERIFY:
        "This transaction format (such as MultiSend batches or custom smart contract executions) cannot be verified by the local guard. Never assume unverified transactions are safe.",
    },
    intendedRecipient: "INTENDED RECIPIENT",
    genuinePayee: "MIMICKED GENUINE PAYEE",
    matchingAnatomy: "VANITY COLLISION ANATOMY",
    prefix: "Shared Prefix",
    suffix: "Shared Suffix",
    divergent: "Mismatched Center",
    collisionEntropy: "Collision Entropy Probability",
    transferDetails: "TRANSFER DETAILS",
    token: "Token / Asset",
    amount: "Transfer Amount",
    abortButton: "Abort Transaction (Safe)",
    proceedButton: "I Understand the Risk / Proceed",
    privacyNotice: "LOCAL CLIENT PRIVACY ACTIVE",
    privacyDisclaimer:
      "All recipient lookups are performed 100% on-device against locally downloaded Arkiv snapshots. Recipient addresses are never transmitted to HexFence servers.",
    snapshotInfo: "Arkiv Evidence Snapshot",
    managePayees: "Approved Safe Payees",
    addPayee: "Add Genuine Payee",
    removePayee: "Remove",
    testLab: "Local Verification Lab",
    simulateCheck: "Simulate Transaction Check",
    copyAddress: "Copy",
    copied: "Copied!",
    noMatchingEvidenceNotice:
      "No matching threat record found in the local Arkiv dataset. Please inspect all 42 characters before signing.",
    cannotVerifyNotice:
      "This transaction type is unsupported by the local validator. Unverified transactions must never receive a false green safety result.",
  },
  hi: {
    appName: "हेक्सफेंस सुरक्षा गार्ड (HexFence)",
    appSubtitle: "सेफ वॉलेट एड्रेस-पॉइजनिंग और वैनिटी स्पूफ सुरक्षा",
    warningTitle: "लेनदेन प्राप्तकर्ता सुरक्षा ऑडिट",
    statusBadge: {
      SUSPICIOUS_LOOKALIKE: "चेतावनी: संदिग्ध वैनिटी पता (Lookalike) पाया गया!",
      APPROVED_PAYEE: "सुरक्षित: स्वीकृत प्राप्तकर्ता सत्यापित",
      NO_MATCHING_EVIDENCE: "सावधानी: कोई पिछला रिकॉर्ड नहीं मिला",
      CANNOT_VERIFY: "असमर्थ: असमर्थित लेनदेन प्रारूप",
    },
    statusDescription: {
      SUSPICIOUS_LOOKALIKE:
        "सावधान: यह प्राप्तकर्ता पता आपके स्वीकृत असली पते के पहले और अंतिम अक्षरों की हूबहू नकल करता है। लेनदेन इतिहास से कभी भी पता कॉपी न करें।",
      APPROVED_PAYEE:
        "यह प्राप्तकर्ता आपके सेफ वॉलेट की सत्यापित स्वीकृत सूची में मौजूद है। लेनदेन सुरक्षित रूप से आगे बढ़ सकता है।",
      NO_MATCHING_EVIDENCE:
        "यह पता स्थानीय अर्काइव (Arkiv) डेटासेट में किसी खतरे से मेल नहीं खाता। ध्यान दें: सबूत की अनुपस्थिति सुरक्षा की गारंटी नहीं है। सभी 42 अक्षरों की स्वयं जांच करें।",
      CANNOT_VERIFY:
        "यह लेनदेन प्रारूप (जैसे मल्टीसेंड या कस्टम कॉन्ट्रैक्ट) स्थानीय गार्ड द्वारा जांचा नहीं जा सकता। असमर्थित लेनदेन को कभी भी सुरक्षित न मानें।",
    },
    intendedRecipient: "लक्षित प्राप्तकर्ता पता",
    genuinePayee: "नकल किया गया असली पता",
    matchingAnatomy: "वैनिटी टकराव विश्लेषण",
    prefix: "समान शुरुआत (Prefix)",
    suffix: "समान अंत (Suffix)",
    divergent: "भिन्न मध्य अक्षर",
    collisionEntropy: "टकराव संभाव्यता (Entropy)",
    transferDetails: "लेनदेन विवरण",
    token: "टोकन / संपत्ति",
    amount: "लेनदेन राशि",
    abortButton: "लेनदेन रद्द करें (सेफ पर लौटें)",
    proceedButton: "मुझे जोखिम ज्ञात है / आगे बढ़ें",
    privacyNotice: "स्थानीय क्लाइंट गोपनीयता सक्रिय",
    privacyDisclaimer:
      "सभी सत्यापन 100% आपके डिवाइस पर स्थानीय रूप से होते हैं। कोई भी पता सर्वर पर नहीं भेजा जाता।",
    snapshotInfo: "अर्काइव स्नैपशॉट स्थिति",
    managePayees: "स्वीकृत सेफ प्राप्तकर्ता",
    addPayee: "नया स्वीकृत पता जोड़ें",
    removePayee: "हटाएं",
    testLab: "स्थानीय परीक्षण प्रयोगशाला",
    simulateCheck: "सत्यापन का परीक्षण करें",
    copyAddress: "कॉपी",
    copied: "कॉपी हो गया!",
    noMatchingEvidenceNotice:
      "स्थानीय डेटा में कोई रिकॉर्ड नहीं मिला। हस्ताक्षर करने से पहले सभी 42 अक्षरों की पुनः जांच करें।",
    cannotVerifyNotice:
      "यह लेनदेन प्रारूप स्थानीय रूप से सत्यापित नहीं किया जा सकता। असमर्थित लेनदेन को कभी भी हरा सुरक्षा परिणाम नहीं दिया जाता।",
  },
};

