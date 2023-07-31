import { defineConfig } from "tsup"

export default defineConfig({
  tsconfig: "tsconfig.build.json",
  entry: ["src/index.ts", "src/server.ts"],
  format: "esm",
  treeshake: true,
  dts: true,
  sourcemap: true,
  // UPSTREAM: Required as nsm imported code relies on __filename  and __dirname.
  shims: true,
  // UPSTREAM: Required as imported code relies on require.
  // https://github.com/evanw/esbuild/issues/1921#issuecomment-1623640043
  banner: {
    js: `
    import { createRequire as topLevelCreateRequire } from 'module';
    const require = topLevelCreateRequire(import.meta.url);
    `,
  },
})
