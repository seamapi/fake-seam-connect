import { z } from "zod"

import { createPageCursorSchema } from "lib/api/pagination.ts"

export const pagination = z.object({
  has_next_page: z.boolean(),
  next_page_cursor: z.string().base64().nullable(),
  next_page_url: z.string().url().nullable(),
})

export const device_internal_page_cursor = z.tuple([
  z.string(),
  z.object({
    created_at: z.coerce.date(),
    device_id: z.string(),
  }),
])

export const device_page_cursor = createPageCursorSchema(
  device_internal_page_cursor,
)

export const connected_account_internal_page_cursor = z.tuple([
  z.string(),
  z.object({
    created_at: z.coerce.date(),
    connected_account_id: z.string(),
  }),
])

export const connected_account_page_cursor = createPageCursorSchema(
  connected_account_internal_page_cursor,
)
