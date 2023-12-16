import type { Middleware } from "nextlove"

import {
  getSingletonDatabase,
  type ZustandDatabase,
} from "lib/database/index.ts"

export const withDb: Middleware<{
  db: ZustandDatabase
}> = (next) => (req, res) => {
  if (process.env.NODE_ENV === "test" && req.db == null) {
    throw new Error(
      `In the test environment, req.db must be set by server middleware.`,
    )
  }

  req.db ??= getSingletonDatabase()
  return next(req, res)
}
