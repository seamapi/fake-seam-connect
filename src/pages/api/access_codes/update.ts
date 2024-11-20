import { NotFoundException } from "nextlove"
import { z } from "zod"

import { action_attempt, timestamp } from "lib/zod/index.ts"

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
    sync: z.boolean().default(false),
  })
  .refine((value) => {
    if (
      value.type === "time_bound" &&
      (value.starts_at == null || value.ends_at == null)
    ) {
      return false
    }

    return true
  }, "'time_bound' Access codes must include both starts_at and ends_at")
  .refine((value) => {
    if (
      (value.starts_at != null && value.ends_at == null) ||
      (value.ends_at != null && value.starts_at == null)
    ) {
      return false
    }
    return true
  }, "Both starts_at and ends_at must be provided if one is")

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["POST"],
  jsonBody: json_body,
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { access_code_id, code, name, starts_at, ends_at, device_id, sync } =
    req.body

  const access_code = req.db.findAccessCode({ access_code_id, device_id })

  if (access_code == null) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: `Could not find an access_code with device_id or access_code_id`,
      data: { device_id, access_code_id },
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "UPDATE_ACCESS_CODE",
  })
  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  if (starts_at !== undefined && ends_at !== undefined) {
    req.db.updateAccessCode({
      access_code_id,
      name: name ?? access_code.name,
      type: "time_bound",
      code: code ?? access_code.code,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: new Date(ends_at).toISOString(),
    })
  } else {
    req.db.updateAccessCode({
      access_code_id,
      name: name ?? access_code.name,
      type: "ongoing",
      code: code ?? access_code.code,
    })
  }

  res
    .status(200)
    .json({ action_attempt: sync ? action_attempt_sync : action_attempt })
})
