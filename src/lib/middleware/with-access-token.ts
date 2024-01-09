import { HttpException, type Middleware, UnauthorizedException } from "nextlove"

import type { Database } from "lib/database/index.ts"

import { hashLongToken } from "lib/tokens/generate-api-key.ts"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const extractLongToken = (token: string) =>
  token.split("_").slice(-1)?.[0]

export const extractShortToken = (token: string) => token.split("_")?.[1]

export const extractLongTokenHash = (token: string) =>
  hashLongToken(extractLongToken(token) ?? "")

export const withAccessToken: Middleware<
  {
    auth: {
      auth_mode: "access_token"
    }
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")?.[1]
  if (token == null) return res.status(401).end("Unauthorized")

  const is_at = token.includes("seam_at")
  const long_token = token.split("_")?.[2]
  const short_token = token.split("_")?.[1]

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

    req.auth = {
      auth_mode: "access_token",
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
