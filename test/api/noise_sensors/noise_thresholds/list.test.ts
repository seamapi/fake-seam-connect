import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /noise_sensors/noise_thresholds/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

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

  t.is(noise_thresholds.length, 1)
})
