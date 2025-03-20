import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("POST /_fake/enter_bridge_pairing_code", async (t: ExecutionContext) => {
  const { axios, db, seed } = await getTestServer(t)
  const seed_result = seedDatabase(db)

  const { data } = await axios.get(
    "/seam/bridge/v1/bridge_client_sessions/get",
    {
      headers: {
        Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
      },
    },
  )

  t.is(data.bridge_client_session.tailscale_auth_key, null)

  const {pairing_code} = data.bridge_client_session

  await axios.post("/_fake/enter_bridge_pairing_code", {
    pairing_code,
  })

  const { data: {bridge_client_session: paired_bridge_client_session} } = await axios.get(
    "/seam/bridge/v1/bridge_client_sessions/get",
    {
      headers: {
        Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
      },
    },
  )

  t.truthy(paired_bridge_client_session.tailscale_auth_key)
})
