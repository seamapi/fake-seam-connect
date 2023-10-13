import axios from "axios"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const forwardedHeaders = ["content-type", "last-modified", "cache-control"]

export default withRouteSpec({
  methods: ["GET"],
  auth: "none",
  queryParams: z.object({
    image_id: z.string(),
  }),
} as const)(async ({ db, query, baseUrl }, res) => {
  if (db.devicedbConfig == null || baseUrl == null) {
    res.status(404).end()
    return
  }

  const { data, headers, status } = await axios.get("/images/view", {
    params: {
      image_id: query.image_id,
    },
    baseURL: db.devicedbConfig.url,
    headers: {
      "x-vercel-protection-bypass": db.devicedbConfig.vercelProtectionBypassSecret,
    },
    validateStatus: () => true,
    responseType: "arraybuffer",
  })

  res.status(status)
  for (const header of forwardedHeaders) {
    if (headers[header] != null) {
      res.setHeader(header, headers[header])
    }
  }

  res.send(data)
})
