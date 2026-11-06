import { HexFenceDatabaseStore } from "./store";
import { env } from "../config/env";

export type ConnectionStatus = "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";

class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private store: HexFenceDatabaseStore | null = null;
  private status: ConnectionStatus = "DISCONNECTED";
  private lastError: Error | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  public async connect(): Promise<HexFenceDatabaseStore> {
    if (this.store && this.status === "CONNECTED") {
      return this.store;
    }

    this.status = "CONNECTING";
    try {
      this.store = new HexFenceDatabaseStore(env.DATABASE_URL);
      await this.store.initialize();
      this.status = "CONNECTED";
      this.lastError = null;
      console.log(`✅ [HexFence DB] Database successfully connected to: ${env.DATABASE_URL}`);
      return this.store;
    } catch (err: any) {
      this.status = "ERROR";
      this.lastError = err;
      console.error("❌ [HexFence DB] Failed to establish database connection:", err);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    this.status = "DISCONNECTED";
    this.store = null;
    console.log("🛑 [HexFence DB] Database disconnected.");
  }

  public getStore(): HexFenceDatabaseStore {
    if (!this.store || this.status !== "CONNECTED") {
      throw new Error("Database is not connected. Call connect() first.");
    }
    return this.store;
  }

  public healthCheck() {
    return {
      status: this.status,
      databaseUrl: env.DATABASE_URL,
      lastError: this.lastError ? this.lastError.message : null,
      stats: this.store ? this.store.getStats() : null,
    };
  }
}

export const dbConnection = DatabaseConnectionManager.getInstance();

