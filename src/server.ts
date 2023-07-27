#!/usr/bin/env node

import { argv, env, exit } from "node:process"

import { createFake } from "./index.ts"

const main = async (): Promise<void> => {
  const port = env["PORT"] == null ? undefined : Number(env["PORT"])
  const shouldSeed = !argv.includes("--no-seed")

  const fake = await createFake()
  if (shouldSeed) await fake.seed()
  await fake.startServer({ port })
  // eslint-disable-next-line no-console
  console.log(fake.serverUrl)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  exit(1)
})
