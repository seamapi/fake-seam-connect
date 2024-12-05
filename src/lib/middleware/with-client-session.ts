import type { NextApiRequest } from "next"
import {
  BadRequestException,
  type Middleware,
  UnauthorizedException,
} from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

const getCSTFromHeaders = (headers: NextApiRequest["headers"]) => {
  let client_session_token =
    headers["seam-client-session-token"] ?? headers["client-session-token"]
  if (Array.isArray(client_session_token)) {
    client_session_token = client_session_token[0]
  }
  if (
    client_session_token != null &&
    !client_session_token.startsWith("seam_cst1")
  ) {
    throw new BadRequestException({
      type: "invalid_client_session_token",
      message: "Invalid client session token",
    })
  }
  return client_session_token ?? headers?.authorization?.split("Bearer ")?.[1]
}

export const withClientSession: Middleware<
  {
    auth: Extract<AuthenticatedRequest["auth"], { type: "client_session" }>
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const token = getCSTFromHeaders(req.headers)

  if (token == null) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "Unauthorized",
    })
  }

  if (!token.startsWith("seam_cst1")) {
    throw new BadRequestException({
      type: "invalid_client_session_token",
      message: "Invalid client session token",
    })
  }

  const client_session = req.db.client_sessions.find(
    (cst) => cst.token === token,
  )

  if (client_session == null) {
    throw new UnauthorizedException({
      type: "client_session_not_found",
      message: "Unauthorized (client session not found)",
    })
  }

  const {
    client_session_id,
    publishable_key,
    api_key_id,
    revoked_at,
    expires_at,
    workspace_id,
    connected_account_ids,
    connect_webview_ids,
    user_identity_ids,
  } = client_session

  if (revoked_at != null && new Date(revoked_at) < new Date()) {
    throw new UnauthorizedException({
      type: "client_session_revoked",
      message: "Unauthorized (client session revoked)",
    })
  }

  if (new Date(expires_at) < new Date()) {
    throw new UnauthorizedException({
      type: "client_session_expired",
      message: "Unauthorized (client session expired)",
    })
  }

  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === client_session.workspace_id,
  )
  if (workspace == null) {
    throw new UnauthorizedException({
      type: "workspace_not_found",
      message: "Workspace was not found",
    })
  }

  if (publishable_key == null && api_key_id == null) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "publishable key or api key must be set",
    })
  }

  req.auth = {
    type: "client_session",
    client_session_id,
    method: api_key_id != null ? "api_key" : "publishable_key",
    publishable_key,
    api_key_id,
    workspace_id,
    connected_account_ids,
    connect_webview_ids,
    user_identity_ids,
    sandbox: workspace.is_sandbox,
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
