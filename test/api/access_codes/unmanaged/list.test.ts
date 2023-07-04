import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/create", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  db.addAccessCode({
    device_id: seed.ws2.device1_id,
    name: "Test Access Code",
    code: "1234",
    workspace_id: seed.ws2.workspace_id,
    is_managed: false,
  })
  const {
    data: { access_codes: unmanaged_access_code_list },
  } = await axios.get("/access_codes/unmanaged/list", {
    params: { device_id: seed.ws2.device1_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(unmanaged_access_code_list.length, 1)
})
