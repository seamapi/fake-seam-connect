import { HttpException, type Middleware, NotFoundException } from "nextlove"

import type { Database } from "lib/database/index.ts"

import withApiKey from "./with-api-key.ts"

export const withCSTOrApiKeyOrPublishableKey: Middleware<
  {
    auth:
      | { auth_mode: "api_key"; workspace_id: string }
      | {
          auth_mode: "client_session_token"
          workspace_id: string
          client_session_id: string
          connected_account_ids: string[]
          connect_webview_ids: string[]
        }
      | { auth_mode: "publishable_key"; workspace_id: string }
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
  if (token == null) return res.status(401).end("Unauthorized")

  const is_cst = token.includes("seam_cst")
  const is_pub_key = token.includes("seam_pk")
  const is_api_key = !is_cst && !is_pub_key
  const long_token = token.split("_")?.[2]
  const short_token = token.split("_")?.[1]

  if (short_token == null || long_token == null)
    return res.status(400).end("malformed token")

  if (is_pub_key) {
    const workspace = req.db.workspaces.find(
      (ws) => ws.publishable_key === token
    )
    if (workspace == null)
      throw new NotFoundException({
        type: "workspace_not_found",
        message: "Workspace not found",
      })

    req.auth = {
      auth_mode: "publishable_key",
      workspace_id: workspace.workspace_id,
    }
    return next(req, res)
  }

  if (is_cst) {
    const cst = req.db.client_sessions.find((cst) => cst.token === token)
    if (cst == null)
      throw new NotFoundException({
        type: "client_session_token_not_found",
        message: "Client session token not found",
      })

    req.auth = {
      auth_mode: "client_session_token",
      workspace_id: cst.workspace_id,
      client_session_id: cst.client_session_id,
      connected_account_ids: cst.connected_account_ids ?? [],
      connect_webview_ids: cst.connect_webview_ids ?? [],
    }
    return next(req, res)
  }

  if (is_api_key) {
    return withApiKey(next)(req as any, res)
  }

  throw new HttpException(500, {
    type: "unknown_auth_mode",
    message: "Unknown Auth Mode",
  })
}

withCSTOrApiKeyOrPublishableKey.securitySchema = {
  type: "apiKey",
}

export default withCSTOrApiKeyOrPublishableKey
