import test from "ava"
import type { z } from "zod"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"
import type { thermostat_device_properties } from "lib/zod/device.ts"

test("POST /thermostats/heat_cool with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const heating_set_point_celsius = 31
  const cooling_set_point_celsius = 20

  const {
    data: { action_attempt },
    status,
  } = await axios.post(
    "/thermostats/heat_cool",
    {
      device_id: seed_result.ecobee_device_1,
      heating_set_point_celsius,
      cooling_set_point_celsius,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  t.is(200, status)

  t.is(action_attempt.status, "pending")
  t.is(action_attempt.action_type, "SET_HEAT_COOL")
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
  t.is(device_props.current_climate_setting.hvac_mode_setting, "heat_cool")
  t.is(
    device_props.current_climate_setting.heating_set_point_celsius,
    heating_set_point_celsius,
  )
  t.is(
    device_props.current_climate_setting.cooling_set_point_celsius,
    cooling_set_point_celsius,
  )
})

test("POST /thermostats/heat_cool (below min_heating_cooling_delta_celsius)", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.post(
        "/thermostats/heat_cool",
        {
          device_id: seed_result.ecobee_device_1,
          heating_set_point_celsius: 24,
          cooling_set_point_celsius: 22,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
  )

  t.is(err?.status, 400)

  t.is(err?.response.error.type, "invalid_heating_cooling_delta")
})
