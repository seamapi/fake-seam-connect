import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /bridge/v1/bridge_client_sessions/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const { data } = await axios.get(
    "/seam/bridge/v1/bridge_client_sessions/get",
    {
      headers: {
        Authorization: `Bearer ${seed.bridge_client_session.bridge_client_session_token}`,
      },
    },
  )

  t.is(
    data.bridge_client_session.bridge_client_session_id,
    seed.bridge_client_session.bridge_client_session_id,
  )
})
