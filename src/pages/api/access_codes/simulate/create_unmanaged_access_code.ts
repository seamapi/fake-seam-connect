import { BadRequestException } from "nextlove"
import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    name: z.string(),
    code: z.string().min(4).max(8).regex(/^\d+$/, "Must only contain digits"),
  }),
  jsonResponse: z.object({ access_code }),
} as const)(async (req, res) => {
  const { device_id, name, code: req_code } = req.body

  const device = req.db.devices.find((d) => d.device_id === device_id)

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  if (device?.device_type !== "august_lock") {
    throw new BadRequestException({
      type: "device_type_not_supported",
      message: `Device type "${device.device_type}" is not supported for simulating creation of unmanaged codes`,
    })
  }

  const code = req_code ?? Math.random().toString().slice(-4)

  const access_code = req.db.addAccessCode({
    code,
    device_id,
    name: name ?? "New Fake Unmanaged Access Code",
    workspace_id: req.auth.workspace_id,
    type: "ongoing",
    is_managed: false,
  })

  res.status(200).json({ access_code })
})
