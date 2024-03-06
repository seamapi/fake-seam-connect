import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/entrances/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  let entrances_list_res = await axios.get("/acs/entrances/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.true(entrances_list_res.data.acs_entrances.length > 0)

  // List by acs_system_id
  entrances_list_res = await axios.get("/acs/entrances/list", {
    data: {
      acs_system_id: "some_system_id",
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(
    entrances_list_res.data.acs_entrances.every(
      (e) => e.acs_system_id === acs_system_id,
    ),
  )

  // List by non-existent acs_system_id
  entrances_list_res = await axios.get("/acs/entrances/list", {
    data: {
      acs_system_id: "some_system_id",
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(entrances_list_res.data.acs_entrances.length, 0)
})
