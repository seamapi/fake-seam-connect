import type { Middleware } from "nextlove"

export const withBaseUrl: Middleware<{
  baseUrl: string | undefined
}> = (next) => (req, res) => {
  return next(req, res)
}
