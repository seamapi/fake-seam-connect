import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"

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

test("GET /client_sessions/get (with workspace outage)", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  db.simulateWorkspaceOutage(seed.ws2.workspace_id, {
    routes: ["/client_sessions/get"],
  })

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/client_sessions/get", {
        headers: {
          Authorization: `Bearer ${seed.ws2.cst}`,
        },
      })
  )
  t.is(err?.status, 503)

  db.simulateWorkspaceOutageRecovery(seed.ws2.workspace_id)

  const {
    data: { client_session },
  } = await axios.get("/client_sessions/get", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(client_session)
})
