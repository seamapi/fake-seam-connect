import { HttpException, type Middleware, UnauthorizedException } from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withClientSession: Middleware<
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

  if (token == null) {
    throw new UnauthorizedException({
      type: "missing_client_session_token",
      message: "Client Session Token is required",
    })
  }

  const is_cst = token.includes("seam_cst")
  const long_token = token.split("_")?.[2]
  const short_token = token.split("_")?.[1]

  if (!is_cst) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "Client session tokens must start with seam_cst.",
    })
  }

  if (short_token == null || long_token == null) {
    throw new HttpException(400, {
      type: "malformed_token",
      message: "Malformed token",
    })
  }

  if (is_cst) {
    const client_session_token = req.db.client_sessions.find(
      (cst) => cst.token === token,
    )

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
