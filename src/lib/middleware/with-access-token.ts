import { HttpException, type Middleware, UnauthorizedException } from "nextlove"
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
      auth: {
        type: RequiresWorkspaceId extends true
          ? Extract<AuthenticatedRequest["auth"], { type: "access_token" }>
          : Extract<
              AuthenticatedRequest["auth"],
              { type: "access_token_without_workspace" }
            >
      }
    },
    {
      db: Database
    }
  > =>
  (next) =>
  async (req, res) => {
    const token = req.headers.authorization?.split("Bearer ")?.[1]
    if (token == null) return res.status(401).end("Unauthorized")

    const is_at = token.includes("seam_at")
    const long_token = token.split("_")?.[2]
    const short_token = token.split("_")?.[1]

    if (!is_at) {
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

    if (
      (workspace_id == null || workspace_id.length === 0) &&
      is_workspace_id_required
    ) {
      throw new UnauthorizedException({
        type: "missing_workspace_id",
        message: "Workspace ID is required",
      })
    }

    if (short_token == null || long_token == null)
      return res.status(400).end("malformed token")

    if (is_at) {
      const long_token_hash = extractLongTokenHash(token)

      const access_token = req.db.access_tokens.find(
        (token) => token.long_token_hash === long_token_hash,
      )
      if (access_token == null)
        throw new UnauthorizedException({
          type: "access_token_not_found",
          message: "Access token not found",
        })

      if (is_workspace_id_required) {
        ;(req.auth as unknown as Extract<
          AuthenticatedRequest["auth"],
          { type: "access_token" }
        >) = {
          type: "access_token",
          workspace_id: workspace_id as string,
        }
      } else {
        ;(req.auth as unknown as Extract<
          AuthenticatedRequest["auth"],
          { type: "access_token_without_workspace" }
        >) = {
          type: "access_token_without_workspace",
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

    throw new HttpException(500, {
      type: "unknown_auth_mode",
      message: "Unknown Auth Mode",
    })
  }
