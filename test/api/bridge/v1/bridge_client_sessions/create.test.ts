import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /bridge/v1/bridge_client_sessions/create", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)

  const {
    data: { bridge_client_session },
  } = await axios.post(
    "/seam/bridge/v1/bridge_client_sessions/create",
    {
      bridge_client_name: "test",
      bridge_client_time_zone: "America/Los_Angeles",
      bridge_client_machine_identifier_key: "test_key",
    },
    {
      headers: {
        Authorization: `Bearer certified_client_token`,
      },
    },
  )

  t.truthy(bridge_client_session)
  t.is(bridge_client_session.bridge_client_name, "test")
})
