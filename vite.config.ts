import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    // Bundle all dependencies inline instead of externalizing them.
    // Without this, Nitro externalizes packages like tslib but the Vercel
    // serverless runtime has no node_modules to resolve them from at runtime.
    noExternals: true,
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
