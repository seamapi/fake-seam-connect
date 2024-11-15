import { HttpException, type Middleware, NotFoundException } from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { withApiKey } from "./with-api-key.ts"
import { withClientSession } from "./with-client-session.ts"
import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withClientSessionOrApiKeyOrPublishableKey: Middleware<
  {
    auth: Extract<
      AuthenticatedRequest["auth"],
      | {
          type: "api_key"
        }
      | {
          type: "client_session"
        }
    >
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const token =
    req.headers.authorization?.split("Bearer ")?.[1] ??
    (req.headers["client-session-token"] as string | null) ??
    (req.headers["seam-client-session-token"] as string | null) ??
    (req.headers["seam-publishable-key"] as string | null)
  console.log("🚀 ~ token:", token)
  if (token == null) return res.status(401).end("Unauthorized")

  const is_cst = token.includes("seam_cst")
  console.log("🚀 ~ is_cst:", is_cst)
  const is_pub_key = token.includes("seam_pk")
  console.log("🚀 ~ is_pub_key:", is_pub_key)
  const is_api_key = !is_cst && !is_pub_key
  console.log("🚀 ~ is_api_key:", is_api_key)
  const long_token = token.split("_")?.[2]
  console.log("🚀 ~ long_token:", long_token)
  const short_token = token.split("_")?.[1]
  console.log("🚀 ~ short_token:", short_token)

  if (short_token == null || long_token == null)
    return res.status(400).end("malformed token")

  if (is_pub_key) {
    const workspace = req.db.workspaces.find(
      (ws) => ws.publishable_key === token,
    )

    if (workspace == null)
      throw new NotFoundException({
        type: "workspace_not_found",
        message: "Workspace not found",
      })

    req.auth = {
      type: "client_session",
      workspace_id: workspace.workspace_id,
      publishable_key: workspace.publishable_key,
      method: "publishable_key",
      client_session_id: "test",
      connect_webview_ids: [],
      connected_account_ids: [],
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

  if (is_cst) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return withClientSession(next)(req as any, res)
  }

  if (is_api_key) {
    // Cannot run middleware after auth middleware.
    // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return withApiKey(next)(req as any, res)
  }

  throw new HttpException(500, {
    type: "unknown_auth_mode",
    message: "Unknown Auth Mode",
  })
}

withClientSessionOrApiKeyOrPublishableKey.securitySchema = {
  type: "apiKey",
}
