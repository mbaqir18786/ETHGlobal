import { z } from "zod";

// Ethereum address regex validator: 0x followed by exactly 40 hex characters
export const ethAddressSchema = z
  .string({ required_error: "Ethereum address is required" })
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum address. Must be a 42-character string starting with '0x'.",
  });

// Ethereum tx hash regex validator: 0x followed by 64 hex characters
export const ethTxHashSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{64}$/, {
    message: "Invalid Ethereum transaction hash. Must be a 66-character string starting with '0x'.",
  });

// Schema for Address Investigation Parameter
export const investigateQuerySchema = z.object({
  address: ethAddressSchema,
});

// Schema for Submitting a Community Report
export const createCommunityReportSchema = z.object({
  submittedAddress: ethAddressSchema,
  relatedAddress: ethAddressSchema.optional(),
  txHash: ethTxHashSchema.optional(),
  tokenContract: z.string().max(64).optional().default("ETH"),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),
  supportingEvidence: z.string().max(1000).optional(),
});

// Schema for Submitting a False Positive Report
export const createFalsePositiveReportSchema = z.object({
  address: ethAddressSchema,
  reason: z
    .string({ required_error: "Reason is required" })
    .min(10, "Reason must be at least 10 characters long")
    .max(2000, "Reason cannot exceed 2000 characters"),
  evidenceReference: z.string().max(256).optional(),
  contactEmail: z.string().email("Invalid contact email").optional(),
});

// Schema for Querying Evidence Records
export const getEvidenceQuerySchema = z.object({
  address: ethAddressSchema.optional(),
  status: z
    .enum(["SUSPECTED", "UNDER_REVIEW", "CONFIRMED_BY_REVIEW", "FALSE_POSITIVE", "ALL"])
    .optional()
    .default("ALL"),
  token: z.string().optional().default("ALL"),
  reason: z
    .enum([
      "DUST_TRANSFER",
      "ZERO_VALUE_TRANSFER",
      "GPU_VANITY_COLLISION",
      "HIGH_HAMMING_SIMILARITY",
      "COMMUNITY_REPORT",
      "ALL",
    ])
    .optional()
    .default("ALL"),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

// Schema for Admin Evidence Review Update
export const updateEvidenceStatusSchema = z.object({
  status: z.enum([
    "SUSPECTED",
    "UNDER_REVIEW",
    "CONFIRMED_BY_REVIEW",
    "FALSE_POSITIVE",
  ]),
  reviewNotes: z.string().min(5, "Review notes must be at least 5 characters").max(1000),
  reviewerId: z.string().optional().default("dev-admin"),
});

// Schema for Admin Audit Log Query
export const getAuditLogsQuerySchema = z.object({
  action: z.string().optional(),
  actor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

// Schema for Notification Preferences
export const updateNotificationPreferenceSchema = z.object({
  userReference: z.string().min(3),
  notificationType: z.enum(["EMAIL", "IVR_PHONE", "BROWSER_PUSH", "WEBHOOK"]),
  enabled: z.boolean(),
  destination: z.string().min(3).max(256),
});

