import type { NextApiRequest, NextApiResponse } from "next"
import type { Middleware } from "nextlove"

const withCors: Middleware<Record<string, unknown>> =
  (next) => (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*")
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Seam-Workspace, Authorization, User-Agent, Seam-Sdk-Version, Seam-Publishable-Key, Seam-Client-Session-Token, Client-Session-Token, Seam-Api-Key, Seam-User-Identifier-Key"
    )
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if (req.method === "OPTIONS") {
      res.status(200).end()

      return
    }

    return next(req, res)
  }

export default withCors
