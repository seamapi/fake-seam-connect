import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /bridge/v1/bridge_client_sessions/report_status", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const response = await axios.post(
    "/seam/bridge/v1/bridge_client_sessions/report_status",
    {
      is_tailscale_connected: true,
      tailscale_ip_v4: "100.100.100.100",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
      },
    },
  )

  t.is(response.status, 200)
})
