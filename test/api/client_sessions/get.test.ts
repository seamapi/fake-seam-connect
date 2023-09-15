import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /client_sessions/get (with client session token)", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.get("/client_sessions/get", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(client_session)
})
