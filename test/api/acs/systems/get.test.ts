import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/systems/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  const {
    data: { acs_system },
  } = await axios.get("/acs/systems/get", {
    data: {
      acs_system_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_system.acs_system_id, acs_system_id)
})
