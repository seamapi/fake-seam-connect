import { sortBy } from "lodash"
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
    .optional()
    .transform((page_cursor) => {
      if (page_cursor == null) return page_cursor
      return page_cursor_schema.parse(
        JSON.parse(Buffer.from(page_cursor, "base64").toString("utf8")),
      )
    }),
})

const page_cursor_schema = z.object({
  created_at: z.coerce.date(),
  device_id: z.string(),
  query: z.string(),
})

export default withRouteSpec({
  auth: ["console_session_with_workspace", "client_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    devices: z.array(device),
    pagination: {
      has_next_page: z.boolean(),
      next_page_cursor: z.string().nullable(),
    },
  }),
} as const)(async (req, res) => {
  const { page_cursor } = req.commonParams
  const params =
    page_cursor == null
      ? req.commonParams
      : common_params
          .omit({ page_cursor: true })
          .parse(Object.fromEntries(new URLSearchParams(page_cursor.query)))

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

  const device_id = page_cursor?.device_id
  const startIdx =
    device_id == null
      ? 0
      : devices.findIndex((device) => device.device_id === device_id)

  const endIdx = Math.min(startIdx + limit, devices.length)
  const page = devices.slice(startIdx, endIdx)
  const next_device = devices[endIdx]
  const has_next_page = next_device != null
  const searchParams = new URLSearchParams(req.query)
  searchParams.delete("page_cursor")
  const next_page_cursor = has_next_page
    ? Buffer.from(
        JSON.stringify({
          device_id: next_device.device_id,
          created_at: next_device.created_at,
          query: searchParams.toString(),
        }),
        "utf8",
      ).toString("base64")
    : null

  res.status(200).json({
    devices: page,
    pagination: { has_next_page, next_page_cursor },
  })
})
