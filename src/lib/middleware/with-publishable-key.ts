import {
  AuthMethodDoesNotApplyException,
  type Middleware,
  UnauthorizedException,
} from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/schema.ts"

export const withPublishableKey: Middleware<
  {
    auth: Extract<AuthenticatedRequest["auth"], { type: "publishable_key" }>
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  // Token auth and a missing publishable key both belong to another auth
  // method, so defer to it instead of failing the request here.
  const is_token_auth = req.headers.authorization != null
  const publishable_key = req.headers["seam-publishable-key"]
  if (is_token_auth || publishable_key == null) {
    throw new AuthMethodDoesNotApplyException()
  }

  if (typeof publishable_key !== "string") {
    throw new UnauthorizedException({
      type: "invalid_publishable_key",
      message: "seam-publishable-key must be a string",
    })
  }

  const { user_identifier_key } = req.body

  if ((user_identifier_key?.trim() ?? "").length === 0) {
    throw new UnauthorizedException({
      type: "publishable_key_requires_user_identifier_key",
      message: "user_identifier_key is required with publishable_key",
    })
  }

  const workspace = req.db.workspaces.find(
    (w) => w.publishable_key === publishable_key,
  )

  if (workspace == null) {
    throw new UnauthorizedException({
      type: "workspace_not_found",
      message: "Cannot find workspace associated with this publishable_key",
    })
  }

  req.auth = {
    type: "publishable_key",
    workspace_id: workspace.workspace_id,
    publishable_key,
    sandbox: workspace.is_sandbox,
  }

  return next(req, res)
}
