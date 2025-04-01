import { createHash } from "node:crypto"

import { serializeUrlSearchParams } from "@seamapi/url-search-params-serializer"
import { sortBy } from "lodash"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import { device, device_type } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

export const common_params = z.object({
  device_ids: z.array(z.string()).optional(),
  connected_account_id: z.string().optional(),
  connected_account_ids: z.array(z.string()).optional(),
  device_type: device_type.optional(),
  device_types: z.array(device_type).optional(),
  manufacturer: z.string().optional(),
  limit: z.coerce.number().int().positive().default(500),
  page_cursor: z
    .string()
    .base64()
    .optional()
    .nullable()
    .transform((page_cursor) => {
      if (page_cursor == null) return page_cursor
      return page_cursor_schema.parse(
        JSON.parse(Buffer.from(page_cursor, "base64").toString("utf8")),
      )
    }),
})

const page_cursor_schema = z.tuple([
  z.string(),
  z.object({
    created_at: z.coerce.date(),
    device_id: z.string(),
  }),
])

export default withRouteSpec({
  auth: ["console_session_with_workspace", "client_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    devices: z.array(device),
    pagination: z.object({
      has_next_page: z.boolean(),
      next_page_cursor: z.string().base64().nullable(),
      next_page_url: z.string().url().nullable(),
    }),
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

  const {
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
    manufacturer,
    limit,
  } = params

  const { workspace_id } = req.auth

  let devices = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
    manufacturer,
  })

  // If the user is not an admin, filter out devices that they don't have access to
  if (req.auth.type === "client_session") {
    const auth_connected_account_ids = req.auth.connected_account_ids

    devices = devices.filter((d) =>
      auth_connected_account_ids.includes(d.connected_account_id ?? ""),
    )
  }

  devices = sortBy(devices, ["created_at", "device_id"])

  const device_id = page_cursor_pointer?.device_id
  const startIdx =
    device_id == null
      ? 0
      : devices.findIndex((device) => device.device_id === device_id)

  const endIdx = Math.min(startIdx + limit, devices.length)
  const page = devices.slice(startIdx, endIdx)
  const next_device = devices[endIdx]
  const has_next_page = next_device != null

  let next_page_cursor = null
  if (has_next_page) {
    const next_page_cursor_data = page_cursor_schema.parse([
      query_hash,
      {
        device_id: next_device.device_id,
        created_at: next_device.created_at,
      },
    ])
    next_page_cursor = Buffer.from(
      JSON.stringify(next_page_cursor_data),
      "utf8",
    ).toString("base64")
  }

  const next_page_url = getNextPageUrl(next_page_cursor, { req })

  res.status(200).json({
    devices: page,
    pagination: { has_next_page, next_page_cursor, next_page_url },
  })
})

const getNextPageUrl = (
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

const getPageCursorQueryHash = (params: Record<string, unknown>): string => {
  const query = serializeUrlSearchParams(params)
  return createHash("sha256").update(query).digest("hex")
}
