import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /client_sessions/get_or_create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.request({
    url: "/client_sessions/get_or_create",
    method: "POST",
    headers: {
      "Seam-Publishable-Key": seed.ws2.publishable_key,
    },
    data: {
      user_identifier_key: "hello_world",
    },
  } as any)

  t.truthy(client_session)

  const {
    data: { client_session_2 },
  } = await axios.request({
    url: "/client_sessions/get_or_create",
    method: "POST",
    headers: {
      "Seam-Publishable-Key": seed.ws2.publishable_key,
    },
    data: {
      user_identifier_key: "hello_world",
    },
  } as any)

  t.is(client_session.client_session_id, client_session_2.client_session_id)
})
