import { z } from "zod"

import { access_code,type AccessCode } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

import { json_body as create_ac_json_body } from "./create.ts"

const json_body = z
  .object({
    device_ids: z.string().array(),
    behavior_when_code_cannot_be_shared: z
      .enum(["throw", "create_random_code"])
      .default("throw"),
  })
  .merge(
    create_ac_json_body.omit({
      common_code_key: true,
      device_id: true,
      sync: true,
    })
  )

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: json_body,
  jsonResponse: z.object({
    access_codes: z.array(access_code),
  }),
} as const)(async (req, res) => {
  const {
    code: req_code,
    device_ids,
    name,
    starts_at,
    ends_at,
    use_backup_access_code_pool,
  } = req.body

  const created_access_codes: AccessCode[] = []
  const code = req_code ?? Math.random().toString().slice(-4)

  for (const device_id of device_ids) {
    const access_code = req.db.addAccessCode({
      code,
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
      common_code_key: req_code
        ? null
        : `auto_set_by_fake_create_multiple_${code}`,
    })

    created_access_codes.push(access_code)

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
  }

  res.status(200).json({ access_codes: created_access_codes })
})
