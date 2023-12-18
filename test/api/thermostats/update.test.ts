import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /thermostats/update with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const { status } = await axios.post(
    "/thermostats/update",
    {
      device_id: seed_result.ecobee_device_1,
      default_climate_setting: {
        manual_override_allowed: true,
        automatic_heating_enabled: true,
        heating_set_point_celsius: 20,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(200, status)

  const device: any = db.devices.find(
    (device) => device.device_id === seed_result.ecobee_device_1,
  )

  t.is(20, device?.properties.default_climate_setting.heating_set_point_celsius)
})

test("POST /thermostats/update does not throw on manual_override_allowed", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const { status: status2 } = await axios.post(
    "/thermostats/update",
    {
      device_id: seed_result.ecobee_device_1,
      default_climate_setting: {
        manual_override_allowed: true,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(200, status2)
})
