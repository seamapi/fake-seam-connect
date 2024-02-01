import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /noise_sensors/noise_thresholds/create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { action_attempt, noise_threshold },
  } = await axios.post(
    "/noise_sensors/noise_thresholds/create",
    {
      device_id: seed.ws2.noise_sensor_device_id,
      starts_daily_at: "10:00:00[Europe/Stockholm]",
      ends_daily_at: "12:00:00[Europe/Stockholm]",
      noise_threshold_decibels: 80,
      sync: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(action_attempt.status, "success")
  t.is(noise_threshold.device_id, seed.ws2.noise_sensor_device_id)
  t.is(noise_threshold.noise_threshold_decibels, 80)

  const {
    data: { noise_thresholds },
  } = await axios.get("/noise_sensors/noise_thresholds/list", {
    params: {
      device_id: seed.ws2.noise_sensor_device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  // New noise threshold + seeded one
  t.is(noise_thresholds.length, 2)
})
