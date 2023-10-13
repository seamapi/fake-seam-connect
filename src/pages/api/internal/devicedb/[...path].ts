import axios from "axios"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const forwardedHeaders = ["content-type", "last-modified", "cache-control"]

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

  const { data, headers, status } = await axios.get(path.join("/"), {
    params: query,
    baseURL: db.devicedbConfig.url,
    headers: {
      "x-vercel-protection-bypass": db.devicedbConfig.vercelProtectionBypassSecret,
    },
    validateStatus: () => true,
    responseType: "arraybuffer",
  })

  const isJson: boolean =
    headers["content-type"]?.includes("application/json") ?? false

  res.status(status)
  for (const header of forwardedHeaders) {
    if (headers[header] != null) {
      res.setHeader(header, headers[header])
    }
  }

  res.send(isJson ? replaceImageUrls(data, baseUrl) : data)
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
