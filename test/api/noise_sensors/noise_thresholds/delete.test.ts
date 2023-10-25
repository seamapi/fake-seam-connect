import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("DELETE /noise_sensors/noise_thresholds/delete", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { action_attempt },
  } = await axios.delete("/noise_sensors/noise_thresholds/delete", {
    data: {
      device_id: seed.ws2.noise_sensor_device_id,
      noise_threshold_id: seed.ws2.noise_threshold_id,
      sync: true,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(action_attempt.status, "success")

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

  t.is(noise_thresholds.length, 0)
})
