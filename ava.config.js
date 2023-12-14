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
      NODE_ENV: "test",
    },
    extensions: {
      ts: "commonjs",
    },
    nodeArguments: ["--import=tsx"],
  }
}
