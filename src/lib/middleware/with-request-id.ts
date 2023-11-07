import type { Middleware } from "nextlove"
import { v4 as uuidv4 } from "uuid"

export const withRequestId: Middleware<{
  request_id: string
}> = (next) => (req, res) => {
  req.request_id ??= uuidv4()
  res.setHeader("seam-request-id", req.request_id)
  return next(req, res)
}
