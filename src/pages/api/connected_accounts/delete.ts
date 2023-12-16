import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["DELETE", "POST"],
  jsonBody: z.object({
    connected_account_id: z.string(),
    sync: z.boolean().default(false),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { connected_account_id } = req.body

  const connected_account = req.db.connected_accounts.find(
    (cw) => cw.connected_account_id === connected_account_id,
  )
  if (connected_account == null) {
    throw new NotFoundException({
      type: "connected_account_not_found",
      message: "Connected account not found",
    })
  }

  const connected_account_device_ids = req.db.devices
    .filter((device) => device.connected_account_id === connected_account_id)
    .map((device) => device.device_id)
  const connected_account_access_code_ids = req.db.access_codes
    .filter((ac) => connected_account_device_ids.includes(ac.device_id))
    .map((ac) => ac.access_code_id)
  const connected_account_client_sessions = req.db.client_sessions.filter(
    (cs) => cs.connected_account_ids.includes(connected_account_id),
  )

  for (const device_id of connected_account_device_ids) {
    req.db.deleteDevice(device_id)
  }
  for (const access_code_id of connected_account_access_code_ids) {
    req.db.deleteAccessCode(access_code_id)
  }

  req.db.deleteConnectedAccount({ connected_account_id })

  for (const client_session of connected_account_client_sessions) {
    req.db.updateClientSession({
      client_session_id: client_session.client_session_id,
      connected_account_ids: client_session.connected_account_ids.filter(
        (cl) => cl !== connected_account_id,
      ),
    })
  }

  res.status(200).json({})
})
