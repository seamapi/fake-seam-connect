import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { bridge_client_session } from "lib/zod/index.ts"

export default withRouteSpec({
  description: `
  ---
  title: Create a Bridge Client Session
  response_key: bridge_client_session
  undocumented: Seam Bridge Client only.
  ---
  Creates a new bridge client session.
  `,
  auth: "certified_client",
  methods: ["POST"],
  jsonBody: z.object({
    bridge_client_name: z.string(),
    bridge_client_time_zone: z.string(),
    bridge_client_machine_identifier_key: z.string(),
  }),
  jsonResponse: z.object({
    bridge_client_session,
  }),
} as const)(async (req, res) => {
  const { db, body } = req
  const {
    bridge_client_name,
    bridge_client_time_zone,
    bridge_client_machine_identifier_key,
  } = body

  const bridge_client_session_token = `${bridge_client_name}_token`
  const pairing_code = "123456"

  const pairing_code_expires_at = new Date(
    new Date().getTime() + 3 * 60 * 1000,
  ).toISOString()

  const bridge_client_session = db.addBridgeClientSession({
    bridge_client_name,
    bridge_client_time_zone,
    bridge_client_machine_identifier_key,
    bridge_client_session_token,
    pairing_code,
    pairing_code_expires_at,
  })

  res.json({
    bridge_client_session,
  })
})
