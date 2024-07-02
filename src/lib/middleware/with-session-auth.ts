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
    require_workspace_id,
  }: {
    require_workspace_id: RequiresWorkspaceId
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
      workspace_id_from_header !== null &&
      typeof workspace_id_from_header !== "undefined" &&
      !Array.isArray(workspace_id_from_header)
        ? workspace_id_from_header
        : ""

    if (workspace_id.length === 0 && require_workspace_id) {
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

      const cst = req.db.client_sessions.find((cst) =>
        cst.user_identity_ids.includes(decodedJwt.user_identity_id as string),
      )

      if (cst == null) {
        throw new NotFoundException({
          type: "client_session_token_not_found",
          message: "Client session token not found",
        })
      }

      if (require_workspace_id) {
        ;(req.auth as Extract<
          AuthenticatedRequest["auth"],
          {
            type: "user_session"
          }
        >) = {
          type: "user_session",
          workspace_id: cst.workspace_id,
          client_session_id: cst.client_session_id,
          connected_account_ids: cst.connected_account_ids ?? [],
          connect_webview_ids: cst.connect_webview_ids ?? [],
        }
      } else {
        ;(req.auth as Extract<
          AuthenticatedRequest["auth"],
          { type: "user_session_without_workspace" }
        >) = {
          type: "user_session_without_workspace",
          client_session_id: cst.client_session_id,
          connect_webview_ids: cst.connect_webview_ids ?? [],
          connected_account_ids: cst.connected_account_ids ?? [],
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
