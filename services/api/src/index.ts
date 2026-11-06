import { createApp } from "./app";
import { env } from "./config/env";
import { dbConnection } from "./db/connection";

async function bootstrap() {
  console.log("🛡️ [HexFence API] Bootstrapping backend services...");

  // 1. Connect to Database Store
  try {
    await dbConnection.connect();
  } catch (err) {
    console.error("❌ Fatal: Failed to initialize database store:", err);
    process.exit(1);
  }

  // 2. Create Express App
  const app = createApp();

  // 3. Start Listening
  const server = app.listen(env.PORT, () => {
    console.log("============================================================");
    console.log(`🚀 HexFence API Server running at: http://localhost:${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`📋 Documentation: http://localhost:${env.PORT}/api/docs`);
    console.log(`🔍 Address Investigation: http://localhost:${env.PORT}/api/investigate?address=0x...`);
    console.log(`💾 Database: ${env.DATABASE_URL}`);
    console.log("============================================================");
  });

  // Graceful Shutdown Handlers
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, initiating graceful shutdown...`);
    server.close(async () => {
      await dbConnection.disconnect();
      console.log("👋 Server closed cleanly. Goodbye.");
      process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
      console.error("⚠️ Forcefully terminating after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("💥 Unhandled bootstrap error:", err);
  process.exit(1);
});

