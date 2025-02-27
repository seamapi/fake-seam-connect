import type { Middleware } from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

/**
 * Middleware to check the certified client
 * Certified clients are not yet implemented, this middleware is a placeholder.
 * Once implemented, this middleware will be used to verify the authenticity of the client (implementation tbd)
 */
export const withCertifiedClient: Middleware<
  {
    auth: Extract<AuthenticatedRequest["auth"], { type: "certified_client" }>
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  req.auth = {
    type: "certified_client",
  }

  return next(req, res)
}
