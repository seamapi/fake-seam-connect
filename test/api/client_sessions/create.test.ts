import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("POST /client_sessions/create publishable key", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.post(
    "/client_sessions/create",
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
  t.is(client_session.user_identifier_key, "hello_world")
})

test("POST /client_sessions/create api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })

  const seed_result = seedDatabase(db)

  const api_key = db.api_keys.find(
    (a) => a.workspace_id === seed_result.seed_workspace_1,
  )

  const {
    data: { client_session },
  } = await axios.post(
    "/client_sessions/create",
    {
      user_identifier_key: "hello_world",
    },
    {
      headers: {
        Authorization: `Bearer ${api_key?.token}`,
      },
    },
  )

  t.truthy(client_session)
  t.is(client_session.user_identifier_key, "hello_world")
  t.is(
    client_session.api_key_id,
    api_key?.api_key_id,
    "Client session is correctly associated with the api key that was used to create it",
  )
})
