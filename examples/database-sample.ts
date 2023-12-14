import { writeFile } from "node:fs/promises"
import { dirname } from "node:path"

import { createFake } from "@seamapi/fake-seam-connect"
import type { Builder, Command, Describe, Handler } from "landlubber"
import { mkdirp } from "mkdirp"

interface Options {
  outfile: string
}

export const command: Command = "database sample"

export const describe: Describe = "Create sample database."

export const builder: Builder = {
  outfile: {
    type: "string",
    default: "tmp/db.json",
    description: "Where to save the sample database",
  },
}

export const handler: Handler<Options> = async ({ outfile, logger }) => {
  const fake = await createFake()
  const state = await fake.toJSON()
  logger.info(state, "Database State")
  await mkdirp(dirname(outfile))
  await writeFile(outfile, JSON.stringify(state, null, 2))
  logger.info({ outfile }, "Database Written")
}
