import { isUndefined, omitBy } from "lodash"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_user } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["PATCH", "POST"],
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  jsonBody: z
    .object({
      access_schedule: z
        .object({
          starts_at: z.string().datetime(),
          ends_at: z.string().datetime(),
        })
        .optional(),
    })
    .merge(
      acs_user.pick({
        acs_user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        email_address: true,
        hid_acs_system_id: true,
      }),
    ),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const {
    full_name,
    email_address,
    email,
    phone_number,
    access_schedule,
    acs_user_id,
    hid_acs_system_id,
  } = req.body

  const updated_properties = omitBy(
    {
      full_name,
      email: email_address ?? email,
      phone_number,
      access_schedule,
      hid_acs_system_id,
    },
    isUndefined,
  )

  req.db.updateAcsUser({ acs_user_id, ...updated_properties })

  res.status(200).json({})
})
