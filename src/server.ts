#!/usr/bin/env node

import process, { argv, env, exit } from "node:process"

import { createFake } from "lib/fake.ts"
import logger from "lib/logger.ts"

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection", err)
  exit(1)
})

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", err)
  exit(1)
})

const main = async (): Promise<void> => {
  const port = env["PORT"] == null ? undefined : Number(env["PORT"])
  const shouldSeed = argv.includes("--seed")

  const fake = await createFake()

  if (shouldSeed) await fake.seed()

  await fake.startServer({ port, signals: ["SIGINT", "SIGUSR2"] })

  logger.info(fake.serverUrl ?? "")
}

main().catch((err) => {
  logger.error(err)
  exit(1)
})
