import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/systems/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { connected_account1_id: connected_account_id } = seed.ws2

  let acs_systems_list_res = await axios.get("/acs/systems/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.true(acs_systems_list_res.data.acs_systems.length > 0)

  acs_systems_list_res = await axios.get("/acs/systems/list", {
    data: { connected_account_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.true(
    acs_systems_list_res.data.acs_systems.every((acs_system) =>
      acs_system.connected_account_ids.includes(connected_account_id),
    ),
  )

  // No systems should be returned for a non-existent connected account id
  acs_systems_list_res = await axios.get("/acs/systems/list", {
    data: { connected_account_id: "some_connected_account_id" },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_systems_list_res.data.acs_systems.length, 0)
})
