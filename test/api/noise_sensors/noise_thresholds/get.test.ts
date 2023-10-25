import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /noise_sensors/noise_thresholds/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

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
  t.is(noise_threshold.noise_threshold_id, seed.ws2.noise_threshold_id)
})
