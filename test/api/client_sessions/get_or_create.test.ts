import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /client_sessions/get_or_create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.post(
    "/client_sessions/get_or_create",
    {
      user_identifier_key: "hello_world",
    },
    {
      headers: {
        "Seam-Publishable-Key": seed.ws2.publishable_key,
      },
    },
  )

  t.truthy(client_session)

  const {
    data: { client_session: client_session_2 },
  } = await axios.post(
    "/client_sessions/get_or_create",
    {
      user_identifier_key: "hello_world",
    },
    {
      headers: {
        "Seam-Publishable-Key": seed.ws2.publishable_key,
      },
    },
  )

  t.is(client_session.client_session_id, client_session_2.client_session_id)
})
