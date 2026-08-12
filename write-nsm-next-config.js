// UPSTREAM: nextjs-server-modules copies next.config.js into .nsm with a
// require, but its bin registers esbuild-runner, which since Node.js 22.12
// transpiles the ES module to CommonJS instead of letting the require fail and
// fall back to import. nsm then reads the config off the module namespace, so
// rewrites is never a function, is dropped from .nsm/next.config.ts, and every
// route 404s. Rewrite the file ourselves after nsm build.
// https://github.com/seamapi/nextjs-server-modules/blob/main/nsm/scripts/copy-nextjs-config.js

import { writeFile } from "node:fs/promises"

import nextConfig from "./next.config.js"

const config = { ...nextConfig }

if (typeof config.rewrites === "function") {
  config.rewrites = await config.rewrites()
}

await writeFile(
  new URL(".nsm/next.config.ts", import.meta.url),
  `export default ${JSON.stringify(config)}\n`,
)
