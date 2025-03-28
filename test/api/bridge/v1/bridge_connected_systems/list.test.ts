import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /seam/bridge/v1/bridge_connected_systems/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { bridge_connected_systems },
  } = await axios.get("/seam/bridge/v1/bridge_connected_systems/list", {
    headers: {
      Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
    },
  })

  t.is(bridge_connected_systems.length, 1)

  const bridge_connected_system = bridge_connected_systems[0]

  if (bridge_connected_system == null) {
    t.fail("No bridge_connected_system found")
    return
  }

  t.is(bridge_connected_system.workspace_id, seed.ws2.workspace_id)
})
