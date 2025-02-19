import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("multi array param", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    params: {
      device_ids: [seed_result.august_device_1, seed_result.ecobee_device_1],
    },
    // Intentionally force a particular serialization
    paramsSerializer: () =>
      `device_ids[]=${seed_result.august_device_1}&device_ids[]=${seed_result.ecobee_device_1}`,
  })

  t.is(devices.length, 2)
})

test("csv array param", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    params: { device_ids: [seed_result.august_device_1] },
    // Intentionally force a particular serialization
    paramsSerializer: () =>
      `device_ids=${seed_result.august_device_1},${seed_result.ecobee_device_1}`,
  })

  t.is(devices.length, 2)
})

test.failing("index array param", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    params: { device_ids: [seed_result.august_device_1] },
    // Intentionally force a particular serialization
    paramsSerializer: () =>
      `device_ids[0]=${seed_result.august_device_1}&device_ids[1]=${seed_result.ecobee_device_1}`,
  })

  t.is(devices.length, 2)
})

// UPSTREAM: nextlove will parse device_ids= to [''] but it should parse to []
test.failing("empty array param", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    params: { device_ids: [] },
    // Intentionally force a particular serialization
    paramsSerializer: () => "device_ids=",
  })

  t.is(devices.length, 0)
})
