import { NotFoundException } from "nextlove"
import { z } from "zod"

import { access_code, timestamp } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const json_body = z
  .object({
    access_code_id: z.string(),
    device_id: z.string().optional(),
    name: z.string().optional(),
    code: z.string().optional(),
    starts_at: timestamp.optional(),
    ends_at: timestamp.optional(),
    type: z.enum(["ongoing", "time_bound"]).optional(),
  })
  .refine((value) => {
    if (value.type === "time_bound" && (!value.starts_at || !value.ends_at)) {
      return false
    }

    return true
  }, "'time_bound' Access codes must include both starts_at and ends_at")
  .refine((value) => {
    if (
      (value.starts_at && !value.ends_at) ||
      (value.ends_at && !value.starts_at)
    ) {
      return false
    }
    return true
  }, "Both starts_at and ends_at must be provided if one is")

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: json_body,
  jsonResponse: z.object({
    access_code,
  }),
} as const)(async (req, res) => {
  const { access_code_id, code, name, starts_at, ends_at, device_id } = req.body

  const access_code = req.db.findAccessCode({ access_code_id, device_id })

  if (access_code == null) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: `Could not find an access_code with device_id or access_code_id`,
      data: { device_id, access_code_id },
    })
  }

  if (starts_at !== undefined && ends_at !== undefined) {
    const updated = req.db.updateAccessCode({
      access_code_id,
      name: name ?? access_code.name,
      type: "time_bound",
      code: code ?? access_code.code,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: new Date(ends_at).toISOString(),
    })

    res.status(200).json({ access_code: updated })
  }

  const updated = req.db.updateAccessCode({
    access_code_id,
    name: name ?? access_code.name,
    type: "ongoing",
    code: code ?? access_code.code,
  })

  res.status(200).json({ access_code: updated })
})
