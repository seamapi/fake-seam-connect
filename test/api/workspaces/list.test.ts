import test, { type ExecutionContext } from "ava"
import jwt from "jsonwebtoken"

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

test("GET /workspaces/list with console session auth", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const session_token = jwt.sign(
    {
      user_id: seed.ws2.user1_id,
      key: seed.ws2.user1_key,
    },
    "secret",
  )
  const {
    data: { workspaces },
  } = await axios.get("/workspaces/list", {
    headers: {
      Authorization: `Bearer ${session_token}`,
      "Seam-Workspace": seed.ws2.workspace_id,
    },
  })
  t.is(workspaces.length, 1)
  t.is(workspaces[0]?.workspace_id, seed.ws2.workspace_id)
})
