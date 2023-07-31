import { defineConfig } from "tsup"

export default defineConfig({
  tsconfig: "tsconfig.build.json",
  entry: ["src/index.ts", "src/server.ts"],
  format: ["esm", "cjs"],
  treeshake: true,
  dts: true,
  sourcemap: true,
  clean: true,
  // UPSTREAM: Required as nsm imported code relies on __filename  and __dirname.
  shims: true,
})
