import { NotFoundException } from "nextlove"
import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export const commonParams = z
  .object({
    device_id: z.string().optional(),
    access_code_id: z.string().optional(),
    code: z.string().optional(),
  })
  .superRefine(({ access_code_id, code, device_id }, ctx) => {
    if (access_code_id == null) {
      if (code == null && device_id == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Either "access_code_id" OR "code" and "device_id" must be provided',
        })
      }

      if (
        (device_id == null && Boolean(code)) ||
        (Boolean(device_id) && code == null)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both "device_id" and "code" must be provided if one is',
        })
      }
    }

    if (Boolean(access_code_id) && Boolean(code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both "access_code_id" and "code" can not be provided',
      })
    }
  })

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams,
  jsonResponse: z.object({
    access_code,
  }),
} as const)(async (req, res) => {
  const { access_code_id, device_id, code } = req.commonParams

  const access_code = req.db.access_codes.find(
    (ac) =>
      ac.access_code_id === access_code_id ||
      (ac.device_id === device_id && ac.code === code),
  )
  if (access_code == null) {
    throw new NotFoundException({
      type: "not_found",
      message: "Access Code Not Found",
    })
  }
  res.status(200).json({ access_code })
})
