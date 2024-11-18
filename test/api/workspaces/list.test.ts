import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /workspaces/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { workspaces },
  } = await axios.get("/workspaces/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(workspaces.length, 1)
  t.is(workspaces[0]?.workspace_id, seed.ws2.workspace_id)
})

test("GET /workspaces/list with access token auth", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { workspaces },
  } = await axios.get("/workspaces/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
    },
  })

  t.is(workspaces.length, 1)
  t.is(workspaces[0]?.workspace_id, seed.ws2.workspace_id)
})
