import test from "ava"
import type { z } from "zod"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"
import type { thermostat_device_properties } from "lib/zod/device.ts"

test("POST /thermostats/cool with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { ecobee_device_1, seam_apikey1_token } = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const getCurrentDevicePropsWithClimateSetting = async (device_id: string) => {
    const {
      data: { device },
    } = await axios.get("/devices/get", {
      params: { device_id },
    })

    if (!("current_climate_setting" in device.properties)) {
      t.fail(
        `Property 'current_climate_setting' does not exist for device ${device_id}`,
      )
    }

    return device.properties as z.infer<typeof thermostat_device_properties>
  }

  let device_props =
    await getCurrentDevicePropsWithClimateSetting(ecobee_device_1)
  t.is(device_props.current_climate_setting.hvac_mode_setting, "cool")

  await axios.post(
    "/thermostats/heat",
    {
      device_id: ecobee_device_1,
      heating_set_point_celsius: 31,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  device_props = await getCurrentDevicePropsWithClimateSetting(ecobee_device_1)
  t.is(device_props.current_climate_setting.hvac_mode_setting, "heat")

  const {
    data: { action_attempt },
    status,
  } = await axios.post(
    "/thermostats/cool",
    {
      device_id: ecobee_device_1,
      cooling_set_point_celsius: 25,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(200, status)

  t.is(action_attempt.status, "pending")
  t.is(action_attempt.action_type, "SET_COOL")
  t.is(action_attempt.error, null)
  t.is(action_attempt.result, null)

  device_props = await getCurrentDevicePropsWithClimateSetting(ecobee_device_1)
  t.is(device_props.current_climate_setting.hvac_mode_setting, "cool")
})
