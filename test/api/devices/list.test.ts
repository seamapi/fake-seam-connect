import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /devices/list with api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list")

  t.is(devices.length, 3)
})
