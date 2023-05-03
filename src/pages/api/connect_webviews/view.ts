import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  queryParams: z.object({}),
} as const)(async (_req, res) => {
  res.status(200).end(`
    <html>
      <head>
        <title>Connect Webviews</title>
      </head>
      <body>
        <p>
          Not implemented
        </p>
      </body>
    </html>
  `)
})
