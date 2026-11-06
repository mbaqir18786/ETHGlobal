import fs from "fs";
import path from "path";
import {
  ThreatEvidence,
  CommunityReport,
  AuditLog,
  NotificationPreference,
  ReviewStatus,
  EvidenceStatus,
} from "./models";
import {
  INITIAL_EVIDENCE_SEEDS,
  INITIAL_REPORT_SEEDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PREFERENCES,
} from "./seed";

export interface DatabaseState {
  version: string;
  lastUpdated: string;
  threatEvidence: ThreatEvidence[];
  communityReports: CommunityReport[];
  auditLogs: AuditLog[];
  notificationPreferences: NotificationPreference[];
}

export class HexFenceDatabaseStore {
  private filePath: string;
  private state: DatabaseState;
  private isPersisting: boolean = false;
  private pendingWrite: boolean = false;

  constructor(storageUri: string) {
    // Parse storage URI (e.g. "file:./data/hexfence.db.json")
    const cleanPath = storageUri.replace(/^file:/, "");
    this.filePath = path.isAbsolute(cleanPath)
      ? cleanPath
      : path.resolve(process.cwd(), cleanPath);

    this.state = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      threatEvidence: [],
      communityReports: [],
      auditLogs: [],
      notificationPreferences: [],
    };
  }

  /**
   * Initialize database: load from disk or create with seeds
   */
  public async initialize(): Promise<void> {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        this.state = JSON.parse(raw);
      } catch (err) {
        console.warn("⚠️ Corrupt database file encountered, re-initializing with seeds:", err);
        this.loadSeeds();
        await this.persist();
      }
    } else {
      this.loadSeeds();
      await this.persist();
    }
  }

  private loadSeeds(): void {
    this.state = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      threatEvidence: [...INITIAL_EVIDENCE_SEEDS],
      communityReports: [...INITIAL_REPORT_SEEDS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      notificationPreferences: [...INITIAL_PREFERENCES],
    };
  }

  /**
   * Atomic file persistence using temporary file swap
   */
  private async persist(): Promise<void> {
    if (this.isPersisting) {
      this.pendingWrite = true;
      return;
    }

    this.isPersisting = true;
    this.state.lastUpdated = new Date().toISOString();

    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    const payload = JSON.stringify(this.state, null, 2);

    try {
      await fs.promises.writeFile(tempPath, payload, "utf-8");
      await fs.promises.rename(tempPath, this.filePath);
    } catch (err) {
      console.error("❌ Failed to persist database to disk:", err);
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch {
          // ignore cleanup errors
        }
      }
    } finally {
      this.isPersisting = false;
      if (this.pendingWrite) {
        this.pendingWrite = false;
        await this.persist();
      }
    }
  }

  // =========================================================================
  // THREAT EVIDENCE REPOSITORY
  // =========================================================================

  public findEvidenceByAddress(address: string): ThreatEvidence[] {
    const target = address.toLowerCase();
    return this.state.threatEvidence.filter(
      (e) =>
        e.suspectedAddress.toLowerCase() === target ||
        e.referenceAddress.toLowerCase() === target
    );
  }

  public findEvidenceById(id: string): ThreatEvidence | undefined {
    return this.state.threatEvidence.find((e) => e.id.toLowerCase() === id.toLowerCase());
  }

  public queryEvidence(filters: {
    address?: string;
    status?: string;
    token?: string;
    reason?: string;
    limit?: number;
    offset?: number;
  }): { total: number; data: ThreatEvidence[] } {
    let results = [...this.state.threatEvidence];

    if (filters.address) {
      const addr = filters.address.toLowerCase();
      results = results.filter(
        (e) =>
          e.suspectedAddress.toLowerCase() === addr ||
          e.referenceAddress.toLowerCase() === addr
      );
    }

    if (filters.status && filters.status !== "ALL") {
      results = results.filter((e) => e.evidenceStatus === filters.status);
    }

    if (filters.token && filters.token !== "ALL") {
      results = results.filter(
        (e) => e.tokenContract.toLowerCase() === filters.token!.toLowerCase()
      );
    }

    if (filters.reason && filters.reason !== "ALL") {
      results = results.filter((e) => e.detectionReason === filters.reason);
    }

    // Sort newest first
    results.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = results.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    const data = results.slice(offset, offset + limit);

    return { total, data };
  }

  public async updateEvidenceStatus(
    id: string,
    newStatus: EvidenceStatus,
    reviewerId: string,
    notes: string
  ): Promise<ThreatEvidence | null> {
    const item = this.findEvidenceById(id);
    if (!item) return null;

    item.evidenceStatus = newStatus;
    item.investigationNotes = `${notes} (Updated by ${reviewerId} on ${new Date().toISOString()})`;

    await this.persist();
    return item;
  }

  public async createEvidence(
    evidence: Omit<ThreatEvidence, "id" | "timestamp"> & { id?: string; timestamp?: string }
  ): Promise<ThreatEvidence> {
    const id = evidence.id || `EVID-${Date.now().toString().slice(-4)}`;
    const newRecord: ThreatEvidence = {
      ...evidence,
      id,
      timestamp: evidence.timestamp || new Date().toISOString(),
    };

    this.state.threatEvidence.unshift(newRecord);
    await this.persist();
    return newRecord;
  }

  // =========================================================================
  // COMMUNITY REPORTS REPOSITORY
  // =========================================================================

  public async createCommunityReport(
    report: Omit<CommunityReport, "id" | "submissionTimestamp" | "reviewStatus"> & {
      isFalsePositiveDispute?: boolean;
    }
  ): Promise<CommunityReport> {
    const id = `REP-${Date.now().toString().slice(-6)}`;
    const newReport: CommunityReport = {
      ...report,
      id,
      submissionTimestamp: new Date().toISOString(),
      reviewStatus: "PENDING",
    };

    this.state.communityReports.unshift(newReport);
    await this.persist();
    return newReport;
  }

  public findReportById(id: string): CommunityReport | undefined {
    return this.state.communityReports.find((r) => r.id.toLowerCase() === id.toLowerCase());
  }

  public findReportsByAddress(address: string): CommunityReport[] {
    const target = address.toLowerCase();
    return this.state.communityReports.filter(
      (r) =>
        r.submittedAddress.toLowerCase() === target ||
        (r.relatedAddress && r.relatedAddress.toLowerCase() === target)
    );
  }

  public queryReports(filters?: {
    status?: ReviewStatus | "ALL";
    isDispute?: boolean;
    limit?: number;
    offset?: number;
  }): { total: number; data: CommunityReport[] } {
    let results = [...this.state.communityReports];

    if (filters?.status && filters.status !== "ALL") {
      results = results.filter((r) => r.reviewStatus === filters.status);
    }

    if (filters?.isDispute !== undefined) {
      results = results.filter((r) => !!r.isFalsePositiveDispute === filters.isDispute);
    }

    results.sort(
      (a, b) =>
        new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime()
    );

    const total = results.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;

    return { total, data: results.slice(offset, offset + limit) };
  }

  public async updateReportStatus(
    id: string,
    status: ReviewStatus,
    reviewedBy: string,
    resolutionNotes: string
  ): Promise<CommunityReport | null> {
    const report = this.findReportById(id);
    if (!report) return null;

    report.reviewStatus = status;
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date().toISOString();
    report.resolutionNotes = resolutionNotes;

    await this.persist();
    return report;
  }

  // =========================================================================
  // AUDIT LOG REPOSITORY
  // =========================================================================

  public async logAuditEvent(event: {
    action: string;
    actorReference: string;
    relevantMetadata: Record<string, unknown>;
    status?: "SUCCESS" | "FAILED" | "WARNING";
    ipAddress?: string;
  }): Promise<AuditLog> {
    const log: AuditLog = {
      id: `EVT-${Date.now().toString().slice(-6)}`,
      action: event.action,
      actorReference: event.actorReference,
      timestamp: new Date().toISOString(),
      relevantMetadata: event.relevantMetadata,
      ipAddress: event.ipAddress,
      status: event.status || "SUCCESS",
    };

    this.state.auditLogs.unshift(log);
    // Keep max 1000 logs in memory/disk
    if (this.state.auditLogs.length > 1000) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 1000);
    }

    await this.persist();
    return log;
  }

  public queryAuditLogs(filters?: {
    action?: string;
    actor?: string;
    limit?: number;
    offset?: number;
  }): { total: number; data: AuditLog[] } {
    let results = [...this.state.auditLogs];

    if (filters?.action) {
      results = results.filter((l) =>
        l.action.toLowerCase().includes(filters.action!.toLowerCase())
      );
    }

    if (filters?.actor) {
      results = results.filter((l) =>
        l.actorReference.toLowerCase().includes(filters.actor!.toLowerCase())
      );
    }

    const total = results.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;

    return { total, data: results.slice(offset, offset + limit) };
  }

  // =========================================================================
  // NOTIFICATION PREFERENCES REPOSITORY
  // =========================================================================

  public getPreferencesByUser(userReference: string): NotificationPreference[] {
    return this.state.notificationPreferences.filter(
      (p) => p.userReference.toLowerCase() === userReference.toLowerCase()
    );
  }

  public async setPreference(
    pref: Omit<NotificationPreference, "id" | "updatedAt">
  ): Promise<NotificationPreference> {
    const existing = this.state.notificationPreferences.find(
      (p) =>
        p.userReference.toLowerCase() === pref.userReference.toLowerCase() &&
        p.notificationType === pref.notificationType
    );

    if (existing) {
      existing.enabled = pref.enabled;
      existing.destination = pref.destination;
      existing.updatedAt = new Date().toISOString();
      await this.persist();
      return existing;
    }

    const newPref: NotificationPreference = {
      ...pref,
      id: `PREF-${Date.now().toString().slice(-4)}`,
      updatedAt: new Date().toISOString(),
    };
    this.state.notificationPreferences.push(newPref);
    await this.persist();
    return newPref;
  }

  // =========================================================================
  // HEALTH CHECK
  // =========================================================================

  public getStats() {
    return {
      filePath: this.filePath,
      threatEvidenceCount: this.state.threatEvidence.length,
      communityReportsCount: this.state.communityReports.length,
      auditLogsCount: this.state.auditLogs.length,
      notificationPreferencesCount: this.state.notificationPreferences.length,
      lastUpdated: this.state.lastUpdated,
    };
  }
}

