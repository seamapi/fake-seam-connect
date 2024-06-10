import test from "ava"
import type { z } from "zod"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"
import type { thermostat_device_properties } from "lib/zod/device.ts"

test("POST /thermostats/off with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { action_attempt },
    status,
  } = await axios.post(
    "/thermostats/off",
    {
      device_id: seed_result.ecobee_device_1,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(200, status)

  t.is(action_attempt.status, "pending")
  t.is(action_attempt.action_type, "SET_THERMOSTAT_OFF")
  t.is(action_attempt.error, null)
  t.is(action_attempt.result, null)

  const {
    data: { device },
  } = await axios.get("/devices/get", {
    params: { device_id: seed_result.ecobee_device_1 },
  })

  const device_props = device.properties as z.infer<
    typeof thermostat_device_properties
  >
  t.is(device_props.current_climate_setting.hvac_mode_setting, "off")
})
