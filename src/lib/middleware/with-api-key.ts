import jwt from "jsonwebtoken"
import {
  AuthMethodDoesNotApplyException,
  type Middleware,
  UnauthorizedException,
} from "nextlove"
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
  if (req.headers.authorization == null) {
    throw new AuthMethodDoesNotApplyException()
  }

  const token = req.headers.authorization?.split("Bearer ")?.[1]
  if (token == null) {
    throw new AuthMethodDoesNotApplyException()
  }

  // Client session tokens, access tokens and console session tokens all belong
  // to another auth method, so defer to it instead of failing the request here.
  if (token.startsWith("seam_cst1") || token.startsWith("seam_at")) {
    throw new AuthMethodDoesNotApplyException()
  }

  let decodedJwt
  try {
    decodedJwt = jwt.decode(token)
  } catch {}
  if (decodedJwt != null) {
    throw new AuthMethodDoesNotApplyException()
  }

  const api_key = req.db.api_keys.find((key) => key.token === token)

  if (api_key == null) {
    throw new UnauthorizedException({
      type: "unauthorized",
      message: "API Key not found",
    })
  }

  req.auth = {
    type: "api_key",
    api_key_id: api_key.api_key_id,
    api_key_short_token: api_key.short_token,
    token,
    workspace_id: api_key.workspace_id,
  }

  // Cannot run middleware after auth middleware.
  // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return withSimulatedOutage(next as unknown as any)(req as unknown as any, res)
}
