import jwt from "jsonwebtoken"
import {
  BadRequestException,
  InternalServerErrorException,
  type Middleware,
  UnauthorizedException,
} from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import type { UserWorkspace } from "lib/zod/user_workspace.ts"

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

    if (token == null) {
      throw new UnauthorizedException({
        type: "unauthorized",
        message:
          "No token found in header (did you mean to add Authorization?)",
      })
    }

    const workspace_id_from_header = req.headers["seam-workspace"]
    const workspace_id =
      workspace_id_from_header != null &&
      !Array.isArray(workspace_id_from_header)
        ? workspace_id_from_header
        : ""

    if (workspace_id.length === 0 && is_workspace_id_required) {
      throw new BadRequestException({
        type: "missing_workspace_id",
        message:
          "When using user session authentication, you must provide the Seam-Workspace header",
      })
    }

    let decodedJwt: any
    try {
      decodedJwt = jwt.verify(token, "secret")
    } catch (error: any) {
      throw new InternalServerErrorException({
        type: "internal server error",
        message: error.message,
      })
    }

    const { user_id, key } = decodedJwt

    const user_session = req.db.user_sessions.find(
      (us) => us.user_id === user_id && us.key === key,
    )

    if (user_session == null) {
      throw new UnauthorizedException({
        type: "unauthorized",
        message: "Session not found",
      })
    }

    let user_workspace: UserWorkspace | undefined
    if (workspace_id.length !== 0) {
      user_workspace = req.db.user_workspaces.find(
        (uw) => uw.user_id === user_id && uw.workspace_id === workspace_id,
      )

      if (user_workspace == null) {
        throw new UnauthorizedException({
          type: "unauthorized",
          message: "User does not have access to this workspace",
        })
      }
    }

    if (is_workspace_id_required) {
      ;(req.auth as Extract<
        AuthenticatedRequest["auth"],
        {
          type: "user_session"
        }
      >) = {
        type: "user_session",
        user_session_id: user_session.user_session_id,
        workspace_id,
        user_id,
        sandbox: req.db.workspaces.find((w) => w.workspace_id === workspace_id)
          ?.is_sandbox,
      }
    } else {
      ;(req.auth as Extract<
        AuthenticatedRequest["auth"],
        { type: "user_session_without_workspace" }
      >) = {
        type: "user_session_without_workspace",
        user_session_id: user_session.user_session_id,
        user_id,
      }
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
