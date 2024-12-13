import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getDevicesWithFilter } from "lib/util/devices.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["POST", "PATCH"],
  commonParams: z.object({
    device_id: z.string(),
    name: z.string().nullable().optional(),
    is_managed: z.boolean().optional().default(true),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id, is_managed, name } = req.commonParams
  const { workspace_id } = req.auth

  const device = getDevicesWithFilter(req.db, {
    workspace_id,
    device_id,
  })[0]

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
      data: {
        device_id,
      },
    })
  }

  if (!device.is_managed) {
    throw new BadRequestException({
      type: "device_unmanaged",
      message: "Device is unmanaged. Use /devices/unmanaged/update",
      data: {
        device_id,
      },
    })
  }

  req.db.updateDevice({
    device_id,
    is_managed,
    ...(name != null ? { properties: { name } } : {}),
  })

  res.status(200).json({})
})
