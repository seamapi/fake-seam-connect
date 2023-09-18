import test, { type ExecutionContext } from "ava"

import { getTestServer,type SimpleAxiosError } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /thermostats/get with api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { thermostat },
  } = await axios.get("/thermostats/get", {
    params: {
      device_id: seed_result.ecobee_device_1,
    },
  })

  t.is(thermostat.device_id, seed_result.ecobee_device_1)

  // Returns `device_not_found` if the device is not a thermostat
  const err: SimpleAxiosError | undefined = await t.throwsAsync(async () => {
    return await axios.get("/thermostats/get", {
      params: {
        device_id: seed_result.schlage_device_1,
      },
    })
  })

  t.is(err?.response.error.type, "device_not_found")
})
