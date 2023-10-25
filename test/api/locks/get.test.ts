import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /locks/get", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const device = db.devices.find((d) => d.device_id === seed.ws2.device1_id)

  let locks_get_res = await axios.get("/locks/get", {
    params: {
      device_id: device?.device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(locks_get_res.data.lock)
  t.is(locks_get_res.data.lock.device_id, seed.ws2.device1_id)

  locks_get_res = await axios.get("/locks/get", {
    params: {
      name: device?.properties.name,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(locks_get_res.data.lock)
  t.is(locks_get_res.data.lock.device_id, seed.ws2.device1_id)

  const thermostat = db.addDevice({
    connected_account_id: seed.ws2.connected_account1_id,
    device_type: "ecobee_thermostat",
    name: "Test Thermostat",
    workspace_id: seed.ws2.workspace_id,
  })
  locks_get_res = await axios.get("/locks/get", {
    params: {
      device_id: thermostat.device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(locks_get_res.status, 404)
})
