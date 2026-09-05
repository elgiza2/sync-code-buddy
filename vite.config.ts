// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import inject from "@rollup/plugin-inject";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// TON libraries reference Node's global Buffer at module-evaluation time. In the
// browser bundle we inject `import { Buffer } from "buffer"` into any module that
// references it, at build time — this is bulletproof regardless of chunk load
// order (unlike a runtime polyfill). The injection is scoped to the CLIENT
// environment only: the server (Nitro/Cloudflare) build keeps native node:buffer,
// which is exactly what avoids the "node:buffer is not exported" SSR failure.
export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    environments: {
      client: {
        build: {
          rollupOptions: {
            plugins: [
              inject({
                Buffer: ["buffer", "Buffer"],
                include: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.mjs"],
              }),
            ],
          },
        },
      },
    },
  },
});
