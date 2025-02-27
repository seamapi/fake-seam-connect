import { type Middleware, UnauthorizedException } from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

export const withBridgeClientSession: Middleware<
  {
    auth: Extract<
      AuthenticatedRequest["auth"],
      { type: "bridge_client_session" }
    >
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const session_token = req.headers?.authorization?.split("Bearer ")?.[1]

  if (session_token == null) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "Missing Bridge client session auth token",
    })
  }

  const bridge_client_session = req.db.bridge_client_sessions.find(
    (bridge_client_session) =>
      bridge_client_session.bridge_client_session_token === session_token,
  )

  if (bridge_client_session == null) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "Invalid Session",
    })
  }

  req.auth = {
    type: "bridge_client_session",
    bridge_client_session: {
      bridge_client_session_id: bridge_client_session.bridge_client_session_id,
    },
  }

  return next(req, res)
}
