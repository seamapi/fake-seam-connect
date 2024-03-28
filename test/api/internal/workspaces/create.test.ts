import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /internal/workspaces/create", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)

  const {
    data: { user_with_pat },
  } = await axios.post(
    "/internal/integration_fixturing/create_user_with_pat",
    {
      access_token_name: "test",
      email: "email",
    },
    {
      auth: {
        username: "seamtest",
        password: "seamtest",
      },
    },
  )

  const {
    data: { workspace },
  } = await axios.post(
    "/internal/workspaces/create",
    {
      connect_partner_name: "Test",
      is_sandbox: true,
      workspace_name: "Test",
    },
    {
      headers: {
        Authorization: `Bearer ${user_with_pat.pat}`,
      },
    },
  )

  t.truthy(workspace)
  t.is(workspace.connect_partner_name, "Test")
})
