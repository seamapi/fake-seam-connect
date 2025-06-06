import test, { type ExecutionContext } from "ava"
import jwt from "jsonwebtoken"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("GET /devices/list with Console Session", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  const token = jwt.sign(
    {
      user_id: seed_result.john_user_id,
      key: seed_result.john_user_key,
    },
    "secret",
  )

  axios.defaults.headers.common.Authorization = `Bearer ${token}`

  axios.defaults.headers.common["seam-workspace"] = seed_result.seed_workspace_1

  const {
    data: { devices },
  } = await axios.get("/devices/list")

  t.is(devices.length, 5)

  t.is(seed_result.seed_workspace_1, "seed_workspace_1")
})

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

test("GET /devices/list with limit", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { devices },
  } = await axios.get("/devices/list", { params: { limit: 2 } })

  t.is(devices.length, 2)
})

test("GET /devices/list with pages", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  const params = { limit: 2 }

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: {
      devices,
      pagination: { has_next_page, next_page_cursor, next_page_url },
    },
  } = await axios.get("/devices/list")
  t.false(has_next_page)
  t.is(next_page_cursor, null)
  t.is(next_page_url, null)
  t.is(devices.length, 5)

  const {
    data: {
      devices: page1,
      pagination: {
        has_next_page: has_page_2,
        next_page_cursor: page2_cursor,
        next_page_url: page2_url,
      },
    },
  } = await axios.get("/devices/list", { params })

  t.is(page1.length, 2)
  t.true(has_page_2)
  t.truthy(page2_cursor)

  if (page2_url == null) {
    t.fail("Null next_page_url")
    return
  }

  const url = new URL(page2_url)
  t.is(url.pathname, "/devices/list")
  t.deepEqual(url.searchParams.getAll("limit"), ["2"])

  t.deepEqual(page1, [devices[0], devices[1]])

  const {
    data: {
      devices: page2,
      pagination: { has_next_page: has_page_3, next_page_cursor: page3_cursor },
    },
  } = await axios.get("/devices/list", {
    params: { ...params, page_cursor: page2_cursor },
  })

  t.is(page2.length, 2)
  t.true(has_page_3)
  t.truthy(page3_cursor)

  t.deepEqual(page2, [devices[2], devices[3]])

  const {
    data: {
      devices: page3,
      pagination: { has_next_page: has_page_4, next_page_cursor: page4_cursor },
    },
  } = await axios.get("/devices/list", {
    params: { ...params, page_cursor: page3_cursor },
  })

  t.is(page3.length, 1)
  t.false(has_page_4)
  t.is(page4_cursor, null)

  t.deepEqual(page3, [devices[4]])
})

test("GET /devices/list validates query hash", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: {
      pagination: { has_next_page, next_page_cursor },
    },
  } = await axios.get("/devices/list", { params: { limit: 2 } })

  t.true(has_next_page)

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/devices/list", {
        params: { limit: 3, page_cursor: next_page_cursor },
      }),
  )
  t.is(err?.status, 400)
  t.regex(
    (err?.response?.error?.message as string) ?? "",
    /parameters identical/,
  )

  const err_empty = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/devices/list", {
        params: { page_cursor: next_page_cursor },
      }),
  )
  t.is(err_empty?.status, 400)
  t.regex(
    (err_empty?.response?.error?.message as string) ?? "",
    /parameters identical/,
  )

  const err_post = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.post("/devices/list", {
        limit: 3,
        device_types: ["august_lock"],
        page_cursor: next_page_cursor,
      }),
  )
  t.is(err_post?.status, 400)
  t.regex(
    (err_post?.response?.error?.message as string) ?? "",
    /parameters identical/,
  )
})

test("GET /devices/list handles array params", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: {
      pagination: { has_next_page, next_page_cursor, next_page_url },
    },
  } = await axios.get("/devices/list", {
    params: { limit: 1, device_types: ["august_lock", "schlage_lock"] },
  })

  t.true(has_next_page)
  t.truthy(next_page_cursor)

  if (next_page_url == null) {
    t.fail("Null next_page_url")
    return
  }

  const url = new URL(next_page_url)
  t.is(url.pathname, "/devices/list")
  t.deepEqual(url.searchParams.getAll("limit"), ["1"])
  t.deepEqual(url.searchParams.getAll("device_types"), [
    "august_lock",
    "schlage_lock",
  ])
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

  if (device?.properties == null || noise_threshold == null) {
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
