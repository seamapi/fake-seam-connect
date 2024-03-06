import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/entrances/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_entrance1_id: acs_entrance_id } = seed.ws2

  const {
    data: { acs_entrance },
  } = await axios.get("/acs/entrances/get", {
    data: {
      acs_entrance_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_entrance.acs_entrance_id, acs_entrance_id)
})
