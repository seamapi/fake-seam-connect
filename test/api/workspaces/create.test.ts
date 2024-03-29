import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /workspaces/create", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  const {
    data: { workspace },
  } = await axios.post(
    "/workspaces/create",
    {
      connect_partner_name: "Test",
      is_sandbox: true,
      name: "Test",
    },
    {
      headers: {
        Authorization: `Bearer ${seed_result.seam_at1_token}`,
      },
    },
  )

  t.truthy(workspace)
  t.is(workspace.connect_partner_name, "Test")
})
