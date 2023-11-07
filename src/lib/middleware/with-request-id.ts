import type { Middleware } from "nextlove"

import type { Database } from "lib/database/index.ts"

export const withRequestId: Middleware<
  {
    request_id: string
  },
  {
    db: Database
  }
> = (next) => (req, res) => {
  if (req.db == null) {
    return res
      .status(500)
      .end(
        "The withRequestId middleware requires req.db. Use it with the withDb middleware."
      )
  }

  req.request_id ??= req.db.getNextRequestId()
  res.setHeader("seam-request-id", req.request_id)
  return next(req, res)
}
