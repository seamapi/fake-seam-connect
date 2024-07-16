import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"

test("POST /_fake/add_client_session", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)

  const initialClientSessionsCount = db.client_sessions.length

  const payload = {
    workspace_id: seed.ws1.workspace_id,
    user_identifier_key: "some-new-user-identifier-key",
  }

  const {
    status,
    data: { client_session },
  } = await axios.post("/_fake/add_client_session", payload)

  t.is(status, 200)
  t.is(db.client_sessions.length, initialClientSessionsCount + 1)

  t.is(client_session.workspace_id, payload.workspace_id)
  t.is(client_session.user_identifier_key, payload.user_identifier_key)
})

test("POST /_fake/add_client_session - invalid workspace_id", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)

  const payload = {
    workspace_id: "non-existent-workspace-id",
    user_identifier_key: "some-user-identifier-key",
  }

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () => await axios.post("/_fake/add_client_session", payload),
  )

  t.is(err?.status, 404)
})
