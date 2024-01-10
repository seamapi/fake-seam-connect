import type { Middleware } from "nextlove"

import { withSimulatedOutage } from "./with-simulated-outage.ts"

export const withAdminAuth: Middleware<{
  auth: { auth_mode: "admin" }
}> = (next) => async (req, res) => {
  const encoded_credentials = req.headers.authorization?.split("Basic ")?.[1]
  if (encoded_credentials == null) return res.status(401).end("Unauthorized")

  const auth = Buffer.from(encoded_credentials, "base64").toString().split(":")
  const username = auth[0]
  const password = auth[1]

  if (
    username !== process.env["ADMIN_USERNAME"] &&
    password !== process.env["ADMIN_PASSWORD"]
  ) {
    return res.status(401).end("Bad credentials")
  }

  req.auth = { auth_mode: "admin" }

  // Cannot run middleware after auth middleware.
  // UPSTREAM: https://github.com/seamapi/nextlove/issues/118
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return withSimulatedOutage(next as unknown as any)(req as unknown as any, res)
}
