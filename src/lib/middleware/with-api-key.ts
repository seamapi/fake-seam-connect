import { type Middleware, UnauthorizedException } from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withApiKey: Middleware<
  {
    auth: Extract<AuthenticatedRequest["auth"], { type: "api_key" }>
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  if (req.db == null) {
    return res
      .status(500)
      .end(
        "The withApiKey middleware requires req.db. Use it with the withDb middleware.",
      )
  }

  const token = req.headers.authorization?.split("Bearer ")?.[1]
  if (token == null) return res.status(401).end("Unauthorized")

  // TODO: Validate authorization.
  // If relevant, add the user or the decoded JWT to the request on req.auth.

  const api_key = req.db.api_keys.find((key) => key.token === token)

  if (api_key == null) {
    throw new UnauthorizedException({
      type: "invalid_api_key",
      message: "Invalid API Key (not found)",
    })
  }

  req.auth = { type: "api_key", workspace_id: api_key.workspace_id }

  // Cannot run middleware after auth middleware.
  // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return withSimulatedOutage(next as unknown as any)(req as unknown as any, res)
}
