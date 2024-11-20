import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["DELETE", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id } = req.commonParams

  const device = req.db.devices.find((d) => d.device_id === device_id)

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const device_access_codes = req.db.access_codes.filter(
    (ac) => ac.device_id === device_id,
  )
  for (const { access_code_id } of device_access_codes) {
    req.db.deleteAccessCode(access_code_id)
  }

  req.db.deleteDevice(device_id)

  res.status(200).json({})
})
