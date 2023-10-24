import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getDevicesWithFilter } from "lib/util/devices.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST", "PATCH"],
  commonParams: z.object({
    device_id: z.string(),
    is_managed: z.literal(true),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id, is_managed } = req.commonParams
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

  if (device.is_managed) {
    throw new BadRequestException({
      type: "device_managed",
      message: "Device is managed. Use /devices/update",
      data: {
        device_id,
      },
    })
  }

  req.db.updateDevice({ device_id, is_managed })

  res.status(200).json({})
})
