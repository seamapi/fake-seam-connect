import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("GET /devices/list with api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list")

  t.is(devices.length, 4)
})

test("GET /devices/list with device_ids filter", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    params: { device_ids: [seed_result.august_device_1] },
  })

  t.is(devices.length, 1)
  t.is(devices[0]?.device_id, seed_result.august_device_1)
})

test("GET /devices/list with simulated workspace outage", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seed(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  db.simulateWorkspaceOutage(seed_result.seed_workspace_1)

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () => await axios.get("/devices/list")
  )
  t.is(err?.status, 503)

  db.simulateWorkspaceOutageRecovery(seed_result.seed_workspace_1)
  const { status } = await axios.get("/devices/list")
  t.is(status, 200)
})
