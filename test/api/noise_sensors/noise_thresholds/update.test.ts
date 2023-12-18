import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /noise_sensors/noise_thresholds/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const updated_noise_threshold_decibels = 90

  await axios.patch(
    "/noise_sensors/noise_thresholds/update",
    {
      device_id: seed.ws2.noise_sensor_device_id,
      noise_threshold_id: seed.ws2.noise_threshold_id,
      noise_threshold_decibels: updated_noise_threshold_decibels,
      sync: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { noise_threshold },
  } = await axios.get("/noise_sensors/noise_thresholds/get", {
    params: {
      noise_threshold_id: seed.ws2.noise_threshold_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(noise_threshold)
  t.is(
    noise_threshold.noise_threshold_decibels,
    updated_noise_threshold_decibels,
  )
})
