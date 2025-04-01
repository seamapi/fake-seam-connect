/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from "ava"
import type { z } from "zod"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"
import type { thermostat_device_properties } from "lib/zod/device.ts"

test("POST /thermostats/create_climate_preset with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { ecobee_device_1, seam_apikey1_token } = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const getCurrentDeviceProps = async (device_id: string) => {
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

  let deviceProps = await getCurrentDeviceProps(ecobee_device_1)

  t.is(deviceProps.available_climate_presets.length, 0)

  const { status } = await axios.post(
    "/thermostats/create_climate_preset",
    {
      climate_preset_key: "testpresett",
      device_id: ecobee_device_1,
      hvac_mode_setting: "heat_cool",
      cooling_set_point_celsius: 18,
      heating_set_point_celsius: 10,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(status, 200)

  deviceProps = await getCurrentDeviceProps(ecobee_device_1)
  t.is(deviceProps.available_climate_presets.length, 1)

  const climatePreset = deviceProps.available_climate_presets[0]
  t.is(climatePreset?.climate_preset_key, "testpresett")

  try {
    await axios.post(
      "/thermostats/create_climate_preset",
      {
        climate_preset_key: "testpresett",
        device_id: ecobee_device_1,
        hvac_mode_setting: "heat_cool",
        cooling_set_point_celsius: 18,
        heating_set_point_celsius: 10,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    t.fail("Should have thrown an error")
  } catch (error) {
    const err = error as SimpleAxiosError
    t.is(err.response.error.type, "climate_preset_exists")
  }
})
