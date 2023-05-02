import { defineConfig } from "tsup"

export default defineConfig({
  tsconfig: "tsconfig.build.json",
  entry: ["src/index.ts"],
  format: "esm",
  treeshake: true,
  dts: true,
  sourcemap: true,
  clean: true,
  banner: {
    js: `
      import { fileURLToPath } from 'node:url';
      import { createRequire as topLevelCreateRequire } from 'node:module';
      import path from 'node:path'
      const require = topLevelCreateRequire(import.meta.url);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
    `,
  },
})
