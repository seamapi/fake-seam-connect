import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"
import {
  THERMOSTAT_DEVICE_TYPES,
  type ThermostatDeviceType,
} from "lib/zod/device.ts"

test("POST /thermostats/list with api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { thermostats },
  } = await axios.get("/thermostats/list")

  t.is(thermostats.length, 1)

  thermostats.forEach((thermostat) => {
    t.true(
      THERMOSTAT_DEVICE_TYPES.includes(
        thermostat.device_type as ThermostatDeviceType
      )
    )
  })
})
