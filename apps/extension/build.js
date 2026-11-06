const esbuild = require("esbuild");
const path = require("path");

async function buildExtension() {
  console.log("⚡ Building HexFence Chrome Extension (Manifest V3)...");

  // 1. Background Service Worker (ESM)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, "src/background/background.ts")],
    bundle: true,
    outfile: path.resolve(__dirname, "dist/background.js"),
    format: "esm",
    target: "es2022",
    sourcemap: true,
  });

  // 2. Content Script (IIFE)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, "src/content/content.ts")],
    bundle: true,
    outfile: path.resolve(__dirname, "dist/content.js"),
    format: "iife",
    target: "es2022",
    sourcemap: true,
  });

  // 3. Warning Dialog UI (IIFE)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, "src/ui/warning.ts")],
    bundle: true,
    outfile: path.resolve(__dirname, "dist/warning.js"),
    format: "iife",
    target: "es2022",
    sourcemap: true,
  });

  // 4. Toolbar Popup UI (IIFE)
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, "src/ui/popup.ts")],
    bundle: true,
    outfile: path.resolve(__dirname, "dist/popup.js"),
    format: "iife",
    target: "es2022",
    sourcemap: true,
  });

  console.log("✅ HexFence Chrome Extension bundled successfully into dist/");
}

buildExtension().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});

