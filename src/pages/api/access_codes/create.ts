import { NotFoundException } from "nextlove"
import { z } from "zod"

import { access_code, timestamp } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export const json_body = z.object({
  device_id: z.string(),
  name: z.string().optional(),
  code: z.string().optional(),
  starts_at: timestamp.optional(),
  ends_at: timestamp.optional(),
  use_backup_access_code_pool: z.boolean().optional().default(false),
})

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: json_body
    .refine((value) => {
      if (
        (value.starts_at != null && value.ends_at == null) ||
        (value.ends_at != null && value.starts_at == null)
      ) {
        return false
      }
      return true
    }, "Both starts_at and ends_at must be provided if one is")
    .refine((value) => {
      if (
        value.use_backup_access_code_pool &&
        value.starts_at == null &&
        value.ends_at == null
      ) {
        return false
      }

      return true
    }, "Cannot use the backup pool for ongoing codes"),
  jsonResponse: z.object({
    access_code,
  }),
} as const)(async (req, res) => {
  const {
    code,
    device_id,
    name,
    starts_at,
    ends_at,
    use_backup_access_code_pool,
  } = req.body

  const device = req.db.devices.find((d) => d.device_id === device_id)
  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const access_code = req.db.addAccessCode({
    code: code ?? Math.random().toString().slice(-4),
    device_id,
    name: name ?? "New Access Code",
    workspace_id: req.auth.workspace_id,
    ...(starts_at != null && ends_at != null
      ? {
          starts_at: new Date(starts_at).toISOString(),
          ends_at: new Date(ends_at).toISOString(),
          type: "time_bound",
        }
      : { type: "ongoing" }),
  })

  req.db.addEvent({
    event_type: "access_code.created",
    workspace_id: req.auth.workspace_id,
    device_id,
    access_code_id: access_code.access_code_id,
    connected_account_id: device.connected_account_id,
  })

  if (use_backup_access_code_pool) {
    const code = Math.random().toString().slice(-4)
    req.db.addAccessCode({
      code,
      device_id,
      name: `New Backup Access Code ${code}`,
      workspace_id: req.auth.workspace_id,
      type: "ongoing",
      is_backup: true,
    })
  }

  res.status(200).json({ access_code })
})
