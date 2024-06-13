import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("GET /devices/list with api key", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list")

  t.is(devices.length, 5)

  for (const device of devices) {
    t.truthy(device.display_name)
    t.truthy("appearance" in device.properties)
    t.truthy("custom_metadata" in device)
  }
})

test("GET /devices/list with filters", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  // device_ids filter
  let devices_res = await axios.get("/devices/list", {
    params: { device_ids: [seed_result.august_device_1] },
  })

  t.is(devices_res.data.devices.length, 1)
  t.is(devices_res.data.devices[0]?.device_id, seed_result.august_device_1)

  // connected_account_id filter
  devices_res = await axios.get("/devices/list", {
    params: { connected_account_id: seed_result.jane_connected_account_id },
  })
  t.true(devices_res.data.devices.length > 0)

  // device_type filter
  devices_res = await axios.get("/devices/list", {
    params: { device_type: "august_lock" },
  })
  t.true(devices_res.data.devices.length > 0)

  // manufacturer filter
  devices_res = await axios.get("/devices/list", {
    params: { manufacturer: "august" },
  })
  t.true(devices_res.data.devices.length > 0)
})

test("GET /devices/list with empty device_ids", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.post("/devices/list", {
    device_ids: [],
  })

  t.is(devices.length, 0)
})

test("GET /devices/list with empty connected_account_ids", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.post("/devices/list", {
    connected_account_ids: [],
  })

  t.is(devices.length, 0)
})

test("GET /devices/list with empty device_types", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.post("/devices/list", {
    device_types: [],
  })

  t.is(devices.length, 0)
})

test("GET /devices/list with simulated workspace outage", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  db.simulateWorkspaceOutage(seed_result.seed_workspace_1, {
    routes: ["/devices/list"],
  })

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/devices/list", { params: { device_ids: ["123"] } }),
  )
  t.is(err?.status, 503)

  db.simulateWorkspaceOutageRecovery(seed_result.seed_workspace_1)
  const { status } = await axios.get("/devices/list", {
    params: { device_ids: ["123"] },
  })
  t.is(status, 200)
})

test("GET /devices/list with currently_triggering_noise_threshold_ids", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const device_id = seed_result.minut_device_1
  const device = db.devices.find((d) => d.device_id === device_id)
  const noise_threshold = db.noise_thresholds[0]

  if (!device || !device.properties || !noise_threshold) {
    t.fail("device not found")
    return
  }

  t.true(
    "currently_triggering_noise_threshold_ids" in device?.properties &&
      (
        device?.properties?.currently_triggering_noise_threshold_ids ?? []
      ).includes(noise_threshold.noise_threshold_id),
  )
})
