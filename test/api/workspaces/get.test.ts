import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /workspaces/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { workspace },
  } = await axios.get("/workspaces/get", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(workspace)
  t.truthy(workspace.company_name)
  t.truthy(workspace.connect_webview_customization)
  t.false(workspace.is_suspended)
  t.is(workspace.workspace_id, seed.ws2.workspace_id)
})
