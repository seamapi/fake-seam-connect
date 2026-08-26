import sortBy from "lodash/sortBy.js"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import { getNextPageUrl, getPageCursorQueryHash } from "lib/api/pagination.ts"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  access_code,
  access_code_internal_page_cursor,
  access_code_page_cursor,
  pagination,
} from "lib/zod/index.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      device_id: z.string().optional(),
      access_code_ids: z.array(z.string()).optional(),
      limit: z.coerce.number().int().positive().default(500),
      page_cursor: access_code_page_cursor,
    })
    .refine(
      ({ device_id, access_code_ids }) =>
        Boolean(device_id) || Boolean(access_code_ids),
      "Either 'device_id' or 'access_code_ids' is required",
    ),
  jsonResponse: z.object({
    access_codes: z.array(access_code),
    pagination,
  }),
} as const)(async (req, res) => {
  const { page_cursor, ...params } = req.commonParams

  const query_hash = getPageCursorQueryHash(params)
  const page_cursor_query_hash = page_cursor?.[0]
  const page_cursor_pointer = page_cursor?.[1]
  if (page_cursor_query_hash != null && page_cursor_query_hash !== query_hash) {
    throw new BadRequestException({
      type: "mismatched_page_parameters",
      message:
        "When using next_page_cursor, the request must send parameters identical to the initial request.",
    })
  }

  const { device_id, access_code_ids, limit } = params

  const access_codes = sortBy(
    req.db.access_codes.filter((ac) =>
      ac.device_id === device_id && access_code_ids != null
        ? access_code_ids.includes(ac.access_code_id)
        : true && !(ac?.is_backup ?? false),
    ),
    ["created_at", "access_code_id"],
  )

  const access_code_id = page_cursor_pointer?.access_code_id
  const startIdx =
    access_code_id == null
      ? 0
      : access_codes.findIndex((ac) => ac.access_code_id === access_code_id)

  const endIdx = Math.min(startIdx + limit, access_codes.length)
  const page = access_codes.slice(startIdx, endIdx)
  const next_access_code = access_codes[endIdx]
  const has_next_page = next_access_code != null

  let next_page_cursor = null
  if (has_next_page) {
    const next_page_cursor_data = access_code_internal_page_cursor.parse([
      query_hash,
      {
        access_code_id: next_access_code.access_code_id,
        created_at: next_access_code.created_at,
      },
    ])
    next_page_cursor = Buffer.from(
      JSON.stringify(next_page_cursor_data),
      "utf8",
    ).toString("base64")
  }

  const next_page_url = getNextPageUrl(next_page_cursor, { req })

  res.status(200).json({
    access_codes: page,
    pagination: { has_next_page, next_page_cursor, next_page_url },
  })
})
