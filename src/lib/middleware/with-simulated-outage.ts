import type { Middleware } from "nextlove"

import type { Database } from "lib/database/index.ts"

export const withSimulatedOutage: Middleware<
  Record<string, never>,
  {
    auth: { workspace_id: string }
    db: Database
  }
> = (next) => async (req, res) => {
  if (req.auth?.workspace_id == null) {
    return next(req, res)
  }

  if (req.db == null) {
    return res
      .status(500)
      .end(
        "The withApiKey middleware requires req.db. Use it with the withDb middleware."
      )
  }

  const outage = req.db.simulatedWorkspaceOutages[req.auth.workspace_id]

  if (outage != null && req.url != null) {
    const routes = (outage.routes as unknown as string[]) ?? []
    const hasOutage = routes.includes(req.url.split("?")[0] ?? "")
    if (hasOutage) return res.status(503).end()
  }

  return next(req, res)
}
