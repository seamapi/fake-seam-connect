import "isomorphic-fetch"

import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const forwardedHeaders = [
  "content-type",
  "etag",
  "last-modified",
  "cache-control",
]

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

  const url = new URL(`${db.devicedbConfig.url}/images/view`)
  url.searchParams.set("image_id", query.image_id)
  const proxyRes = await fetch(url, {
    method: "GET",
    headers: {
      "x-vercel-protection-bypass":
        db.devicedbConfig.vercelProtectionBypassSecret,
    },
  })
  const { status, headers } = proxyRes
  const data = await proxyRes.arrayBuffer()

  for (const key of forwardedHeaders) {
    if (headers.has(key)) {
      const value = headers.get(key)
      if (typeof value === "string") res.setHeader(key, value)
    }
  }

  res.status(status).end(Buffer.from(data))
})
