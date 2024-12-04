import {
  BadRequestException,
  HttpException,
  type Middleware,
  UnauthorizedException,
} from "nextlove"
import type { AuthenticatedRequest } from "src/types/authenticated-request.ts"

import type { Database } from "lib/database/index.ts"

import { hashLongToken } from "lib/tokens/generate-api-key.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const extractLongToken = (token: string) =>
  token.split("_").slice(-1)?.[0]

export const extractShortToken = (token: string) => token.split("_")?.[1]

export const extractLongTokenHash = (token: string) =>
  hashLongToken(extractLongToken(token) ?? "")

export const withAccessToken =
  <RequiresWorkspaceId extends boolean>({
    is_workspace_id_required,
  }: {
    is_workspace_id_required: RequiresWorkspaceId
  }): Middleware<
    {
      auth: RequiresWorkspaceId extends true
        ? Extract<AuthenticatedRequest["auth"], { type: "access_token" }>
        : Extract<
            AuthenticatedRequest["auth"],
            { type: "access_token_without_workspace" }
          >
    },
    {
      db: Database
    }
  > =>
  (next) =>
  async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")?.[1]
    if (!token) {
      throw new UnauthorizedException({
        type: "unauthorized",
        message:
          "No token found in header (did you mean to add Authorization?)",
      })
    }

    if (!token.startsWith("seam_at")) {
      throw new UnauthorizedException({
        type: "unauthorized",
        message: "Access tokens must start with seam_at",
      })
    }

    const workspace_id_from_header = req.headers["seam-workspace"]
    const workspace_id =
      workspace_id_from_header != null &&
      !Array.isArray(workspace_id_from_header)
        ? workspace_id_from_header
        : ""
    const is_workspace_id_provided =
      workspace_id != null && workspace_id.length > 0

    if (!is_workspace_id_provided && is_workspace_id_required) {
      throw new BadRequestException({
        type: "missing_workspace_id",
        message:
          "When using access token authentication, you must provide the Seam-Workspace header",
      })
    }

    const long_token_hash = extractLongTokenHash(token)

    const access_token = req.db.access_tokens.find(
      (token) =>
        token.long_token_hash === long_token_hash &&
        (!is_workspace_id_provided || token.workspace_id === workspace_id),
    )
    if (access_token == null) {
      throw new UnauthorizedException({
        type: "unauthorized",
        message: "Access token not found",
      })
    }

    if (is_workspace_id_required) {
      ;(req.auth as unknown as Extract<
        AuthenticatedRequest["auth"],
        { type: "access_token" }
      >) = {
        type: "access_token",
        access_token_id: access_token.access_token_id,
        access_token_short_token: access_token.short_token,
        token,
        user_id: access_token.user_id,
        workspace_id: access_token.workspace_id,
      }
    } else {
      ;(req.auth as unknown as Extract<
        AuthenticatedRequest["auth"],
        { type: "access_token_without_workspace" }
      >) = {
        type: "access_token_without_workspace",
        access_token_id: access_token.access_token_id,
        access_token_short_token: access_token.short_token,
        token,
        user_id: access_token.user_id,
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
