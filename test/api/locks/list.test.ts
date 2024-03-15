import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /locks/list", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)

  let locks_list_res = await axios.get("/locks/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(locks_list_res.data.locks.length, 2)

  db.addDevice({
    connected_account_id: seed.ws2.connected_account1_id,
    device_type: "ecobee_thermostat",
    name: "Test Thermostat",
    workspace_id: seed.ws2.workspace_id,
  })
  locks_list_res = await axios.get("/locks/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(locks_list_res.data.locks.length, 2)

  locks_list_res = await axios.get("/locks/list", {
    params: {
      device_ids: [seed.ws2.device1_id],
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.is(locks_list_res.data.locks.length, 1)
})
