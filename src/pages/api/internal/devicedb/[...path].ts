import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const forwardedHeaders = [
  "content-type",
  "etag",
  "last-modified",
  "cache-control",
]

export default withRouteSpec({
  methods: ["GET", "OPTIONS"],
  auth: "cst_ak_pk",
  queryParams: z
    .object({
      path: z.string().array(),
    })
    .passthrough(),
  jsonResponse: z.any(),
} as const)(async ({ db, query: { path, ...query }, baseUrl }, res) => {
  if (db.devicedbConfig == null || baseUrl == null) {
    res.status(404).end()
    return
  }

  const url = new URL(path.join("/"), db.devicedbConfig.url)
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === "string") url.searchParams.append(k, v)
  }
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

  const isJson: boolean =
    headers.get("content-type")?.includes("application/json") ?? false

  res.status(status)
  res.send(
    isJson ? replaceImageUrls(Buffer.from(data), baseUrl) : Buffer.from(data)
  )
})

const replaceImageUrls = (data: Buffer, baseUrl: string): string => {
  return JSON.stringify(JSON.parse(data.toString("utf8")), (_key, value) => {
    const isImageUrl =
      typeof value === "string" && value.includes("/images/view")
    if (!isImageUrl) return value

    const imageId = new URL(value).searchParams.get("image_id")
    if (imageId == null) {
      throw new Error(`Missing image_id param in ${value}`)
    }

    const proxiedUrl = new URL("/internal/devicedb_image_proxy", baseUrl)
    proxiedUrl.searchParams.set("image_id", imageId)
    return proxiedUrl.toString()
  })
}
