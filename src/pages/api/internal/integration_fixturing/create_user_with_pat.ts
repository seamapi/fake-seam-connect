import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { generateAccessToken } from "lib/tokens/generate-access-token.ts"

export default withRouteSpec({
  auth: "admin",
  methods: ["POST", "PUT"],
  jsonBody: z.object({
    email: z.string(),
    access_token_name: z.string(),
  }),
  jsonResponse: z.object({
    user_with_pat: z.object({
      user_id: z.string(),
      pat: z.string(),
    }),
  }),
} as const)(async (req, res) => {
  const { access_token_name, email } = req.body

  const { short_token, long_token_hash, token } = await generateAccessToken()

  const { user_id } = req.db.addAccessToken({
    access_token_name,
    email,
    short_token,
    long_token_hash,
  })

  res.status(200).json({
    user_with_pat: {
      user_id,
      pat: token,
    },
  })
})
