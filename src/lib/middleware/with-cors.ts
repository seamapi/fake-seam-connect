import { type NextApiRequest, type NextApiResponse } from "next"
import { type Middleware } from "nextlove"

const withCors: Middleware<{}> =
  (next) => (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "")
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Credentials", "true")

    if (req.method === "OPTIONS") {
      res.status(200).end()

      return
    }

    return next(req, res)
  }

export default withCors
