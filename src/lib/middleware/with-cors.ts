import type { NextApiRequest, NextApiResponse } from "next"
import type { Middleware } from "nextlove"

export const withCors: Middleware<Record<string, unknown>> =
  (next) => (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*")
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    res.setHeader(
      "Access-Control-Allow-Headers",
      access_control_allow_headers.join(", ")
    )
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if (req.method === "OPTIONS") {
      res.status(200).end()

      return
    }

    // @ts-expect-error  Unknown issue
    return next(req, res)
  }

const access_control_allow_headers = [
  "x-csrf-token",
  "x-requested-with",
  "accept",
  "accept-version",
  "content-length",
  "content-md5",
  "content-type",
  "date",
  "x-api-version",
  "seam-workspace",
  "authorization",
  "user-agent",
  "seam-sdk-version",
  "seam-sdk-name",
  "seam-publishable-key",
  "seam-client-session-token",
  "client-session-token",
  "seam-api-key",
  "seam-user-identifier-key",
]
