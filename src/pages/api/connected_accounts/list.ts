import { sortBy } from "lodash"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import {
  connected_account,
  connected_account_internal_page_cursor,
  connected_account_page_cursor,
  pagination,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getNextPageUrl, getPageCursorQueryHash } from "lib/api/pagination.ts"

export const common_params = z.object({
  limit: z.coerce.number().int().positive().default(500),
  page_cursor: connected_account_page_cursor,
})

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    connected_accounts: z.array(connected_account),
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

  const { workspace_id } = req.auth

  let accounts = req.db.connected_accounts
    .filter((ca) => ca.workspace_id === workspace_id)
    .filter((ca) =>
      req.auth.type === "client_session"
        ? req.auth.connected_account_ids.includes(ca.connected_account_id)
        : true,
    )

  accounts = sortBy(accounts, ["created_at", "connected_account_id"])

  const connected_account_id = page_cursor_pointer?.connected_account_id
  const startIdx =
    connected_account_id == null
      ? 0
      : accounts.findIndex(
          (account) => account.connected_account_id === connected_account_id,
        )

  const endIdx = Math.min(startIdx + params.limit, accounts.length)
  const page = accounts.slice(startIdx, endIdx)
  const next_account = accounts[endIdx]
  const has_next_page = next_account != null

  let next_page_cursor = null
  if (has_next_page) {
    const next_page_cursor_data = connected_account_internal_page_cursor.parse([
      query_hash,
      {
        connected_account_id: next_account.connected_account_id,
        created_at: next_account.created_at,
      },
    ])
    next_page_cursor = Buffer.from(
      JSON.stringify(next_page_cursor_data),
      "utf8",
    ).toString("base64")
  }

  const next_page_url = getNextPageUrl(next_page_cursor, { req })

  res.status(200).json({
    connected_accounts: page,
    pagination: { has_next_page, next_page_cursor, next_page_url },
  })
})
