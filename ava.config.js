import { promises as fs } from "node:fs"

export default async () => {
  try {
    await fs.access(".nsm")
  } catch {
    throw new Error(`Could not find the .nsm directory.
    > Did you npm run prebuild first?
    `)
  }
  return {
    ignoredByWatcher: ["tmp/**/*"],
    files: ["**/*.test.ts", "!package/**/*"],
    environmentVariables: {
      // UPSTREAM: https://nodejs.org/docs/latest-v18.x/api/esm.html#loaders
      NODE_NO_WARNINGS: "1",
      NODE_ENV: "test",
    },
    extensions: {
      ts: "module",
    },
    nodeArguments: ["--loader=tsx"],
  }
}
