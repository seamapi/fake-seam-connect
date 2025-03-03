import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /bridge/v1/bridge_client_sessions/regenerate_pairing_code", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { bridge_client_session },
  } = await axios.get("/seam/bridge/v1/bridge_client_sessions/get", {
    headers: {
      Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
    },
  })

  const {
    data: { bridge_client_session: updated_bridge_client_session },
  } = await axios.post(
    "/seam/bridge/v1/bridge_client_sessions/regenerate_pairing_code",
    {},
    {
      headers: {
        Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
      },
    },
  )

  t.false(
    updated_bridge_client_session.pairing_code_expires_at ===
      bridge_client_session.pairing_code_expires_at,
  )
})
