import { createHash } from "node:crypto"

import { serializeUrlSearchParams } from "@seamapi/url-search-params-serializer"
import { z } from "zod"

export const getNextPageUrl = (
  next_page_cursor: string | null,
  {
    req,
  }: {
    req: {
      url?: string
      commonParams: Record<string, unknown>
      baseUrl: string | undefined
    }
  },
): string | null => {
  if (req.url == null || req.baseUrl == null) return null
  if (next_page_cursor == null) return null
  const { page_cursor, ...params } = req.commonParams
  const query = serializeUrlSearchParams(params)
  const url = new URL([req.baseUrl, req.url].join(""))
  url.search = query
  url.searchParams.set("next_page_cursor", next_page_cursor)
  url.searchParams.sort()
  return url.toString()
}

export const getPageCursorQueryHash = (
  params: Record<string, unknown>,
): string => {
  const query = serializeUrlSearchParams(params)
  return createHash("sha256").update(query).digest("hex")
}

export const createPageCursorSchema = <T extends z.ZodTypeAny>(
  internal_page_cursor_schema: T,
) =>
  z
    .string()
    .base64()
    .optional()
    .nullable()
    .transform((page_cursor) => {
      if (page_cursor == null) return page_cursor
      return internal_page_cursor_schema.parse(
        JSON.parse(Buffer.from(page_cursor, "base64").toString("utf8")),
      )
    })
