import { HttpException, type Middleware, UnauthorizedException } from "nextlove"

import type { Database } from "lib/database/index.ts"
import type { AuthenticatedRequest } from "src/types/index.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withCst: Middleware<
  {
    auth: Extract<AuthenticatedRequest["auth"], { type: "client_session" }>
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const token =
    req.headers.authorization?.split("Bearer ")?.[1] ??
    (req.headers["client-session-token"] as string | null) ??
    (req.headers["seam-client-session-token"] as string | null)

  if (token == null) return res.status(401).end("Unauthorized")

  const is_cst = token.includes("seam_cst")
  const long_token = token.split("_")?.[2]
  const short_token = token.split("_")?.[1]

  if (short_token == null || long_token == null)
    return res.status(400).end("malformed token")

  if (is_cst) {
    const cst = req.db.client_sessions.find((cst) => cst.token === token)

    if (cst === null || typeof cst === "undefined") {
      throw new UnauthorizedException({
        type: "client_session_token_not_found",
        message: "Client session token not found",
      })
    }
    req.auth = {
      type: "client_session",
      workspace_id: cst.workspace_id,
      client_session_id: cst.client_session_id,
      connected_account_ids: cst.connected_account_ids ?? [],
      connect_webview_ids: cst.connect_webview_ids ?? [],
      publishable_key: null,
      method: "api_key",
    }
    // Cannot run middleware after auth middleware.
    // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return withSimulatedOutage(next as unknown as any)(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req as unknown as any,
      res,
    )
  }

  throw new HttpException(500, {
    type: "unknown_auth_mode",
    message: "Unknown Auth Mode",
  })
}
