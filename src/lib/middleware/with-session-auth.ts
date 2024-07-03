import jwt from "jsonwebtoken"
import {
  HttpException,
  type Middleware,
  NotFoundException,
  UnauthorizedException,
} from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withSessionAuth =
  <RequiresWorkspaceId extends boolean>({
    is_workspace_id_required,
  }: {
    is_workspace_id_required: RequiresWorkspaceId
  }): Middleware<
    {
      auth: Extract<
        AuthenticatedRequest["auth"],
        {
          type: RequiresWorkspaceId extends true
            ? "user_session"
            : "user_session_without_workspace"
        }
      >
    },
    {
      db: Database
    }
  > =>
  (next) =>
  async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")?.[1]

    if (token == null) return res.status(401).end("Unauthorized")

    const workspace_id_from_header = req.headers["seam-workspace"]
    const workspace_id =
      workspace_id_from_header != null &&
      !Array.isArray(workspace_id_from_header)
        ? workspace_id_from_header
        : ""

    if (workspace_id.length === 0 && is_workspace_id_required) {
      throw new UnauthorizedException({
        type: "missing_workspace_id",
        message: "Workspace ID is required",
      })
    }

    const is_jwt = token.startsWith("ey")

    let decodedJwt: any
    if (is_jwt) {
      try {
        decodedJwt = jwt.verify(token, "secret")
      } catch (error) {
        throw new UnauthorizedException({
          type: "invalid_jwt",
          message: "Invalid JWT",
        })
      }

      const user_session = req.db.user_sessions.find(
        (us) => us.user_id === decodedJwt.user_id,
      )

      const user_workspace = req.db.user_workspaces.find(
        (uw) => uw.user_id === decodedJwt.user_id,
      )

      if (user_session == null) {
        throw new NotFoundException({
          type: "user session_not_found",
          message: "User Session not found",
        })
      }

      if (is_workspace_id_required) {
        ;(req.auth as Extract<
          AuthenticatedRequest["auth"],
          {
            type: "user_session"
          }
        >) = {
          type: "user_session",
          workspace_id: workspace_id ?? user_workspace?.workspace_id,
          user_id: user_session.user_id,
        }
      } else {
        ;(req.auth as Extract<
          AuthenticatedRequest["auth"],
          { type: "user_session_without_workspace" }
        >) = {
          type: "user_session_without_workspace",
          user_id: user_session.user_id,
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return withSimulatedOutage(next as unknown as any)(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req as unknown as any,
        res,
      )
    }

    // Cannot run middleware after auth middleware.
    // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

    throw new HttpException(500, {
      type: "unknown_auth_mode",
      message: "Unknown Auth Mode",
    })
  }
