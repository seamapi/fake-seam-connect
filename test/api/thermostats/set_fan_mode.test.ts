import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /thermostats/set_fan_mode with api key", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { action_attempt },
    status,
  } = await axios.post(
    "/thermostats/set_fan_mode",
    {
      device_id: seed_result.ecobee_device_1,
      fan_mode_setting: "on",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  t.is(200, status)

  t.is(action_attempt.status, "pending")
  t.is(action_attempt.action_type, "SET_FAN_MODE")
  t.is(action_attempt.error, null)
  t.is(action_attempt.result, null)
})