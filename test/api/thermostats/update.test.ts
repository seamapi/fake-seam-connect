import test, { type ExecutionContext } from "ava"

import { getTestServer,type SimpleAxiosError } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /thermostats/update with api key", async (t: ExecutionContext) => {
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

  // Throws on missing device
  const deviceNotFoundError: SimpleAxiosError | undefined = await t.throwsAsync(
    async () => {
      return await axios.post("/thermostats/update", {
        device_id: "fake_device_id",
        default_climate_setting: {
          manual_override_allowed: true,
        },
      })
    }
  )

  t.is(deviceNotFoundError?.response.error.type, "device_not_found")

  // Throws on missing manual_override_allowed
  const missingOverrideError: SimpleAxiosError | undefined =
    await t.throwsAsync(async () => {
      return await axios.post("/thermostats/update", {
        device_id: seed_result.ecobee_device_1,
        default_climate_setting: {},
      })
    })

  t.is(
    missingOverrideError?.response.error.message,
    "manual_override_allowed must be defined"
  )
})
