import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /client_sessions/create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.request({
    url: "/client_sessions/create",
    method: "POST",
    headers: {
      "Seam-Publishable-Key": seed.ws2.publishable_key,
    },
    data: {
      user_identifier_key: "hello_world",
    },
  } as any)

  t.truthy(client_session)
})
