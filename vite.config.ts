import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Single source of truth for the app name (final name pending trademark search).
const APP_NAME = "One-Type";
const DESCRIPTION = "Learn to type fast with one hand — offline, private, free.";
const BACKGROUND_COLOR = "#0f101a"; // hsl(232 28% 8%) — dark background token
const THEME_COLOR = "#0f101a";

// "/" for normal hosting, "/OneHandType3/" for GitHub Pages.
let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = `/${base}`;
if (!base.endsWith("/")) base = `${base}/`;

const icon = (name: string, size: number, purpose: "any" | "maskable" = "any") => ({
  src: `icons/${name}.png`,
  sizes: `${size}x${size}`,
  type: "image/png",
  purpose,
});

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      manifestFilename: "manifest.webmanifest",
      includeAssets: ["favicon.svg", "logo.svg"],
      manifest: {
        id: base,
        name: APP_NAME,
        short_name: APP_NAME,
        description: DESCRIPTION,
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "any",
        background_color: BACKGROUND_COLOR,
        theme_color: THEME_COLOR,
        categories: ["education", "productivity"],
        icons: [
          ...[48, 72, 96, 128, 144, 152, 192, 256, 384, 512].map((s) => icon(`icon-${s}`, s)),
          icon("maskable-192", 192, "maskable"),
          icon("maskable-512", 512, "maskable"),
        ],
        shortcuts: [
          { name: "Practice", url: `${base}practice`, icons: [icon("icon-96", 96)] },
          { name: "Learn", url: `${base}curriculum`, icons: [icon("icon-96", 96)] },
          { name: "Stats", url: `${base}stats`, icons: [icon("icon-96", 96)] },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,ico}"],
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
