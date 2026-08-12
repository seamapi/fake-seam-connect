import type { RouteResponse } from "@seamapi/types/devicedb"
import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("GET /internal/devicedb/v1/device_models/list", async (t) => {
  const { axios, get, db } = await getTestServer(t, { seed: false })
  const { seam_apikey1_token } = seedDatabase(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const { data, status } = await get<RouteResponse<"/v1/device_models/list">>(
    "/internal/devicedb/v1/device_models/list",
  )
  t.is(status, 200)
  t.is(data.device_models.length, 1)
})

test("GET /internal/devicedb/v1/device_models/get", async (t) => {
  const { axios, get, db } = await getTestServer(t, { seed: false })
  const { seam_apikey1_token } = seedDatabase(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const {
    data: { device_models },
  } = await get<RouteResponse<"/v1/device_models/list">>(
    "/internal/devicedb/v1/device_models/list",
  )

  const device_model_id = device_models[0]?.device_model_id

  if (device_model_id == null) {
    t.fail("No devices models")
    return
  }

  const { data, status } = await get<RouteResponse<"/v1/device_models/get">>(
    "/internal/devicedb/v1/device_models/get",
    { params: { device_model_id } },
  )
  t.is(status, 200)
  t.is(data.device_model.device_model_id, device_model_id)
})

test("GET /internal/devicedb/v1/manufacturers/list", async (t) => {
  const { axios, get, db } = await getTestServer(t, { seed: false })
  const { seam_apikey1_token } = seedDatabase(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const { data, status } = await get<RouteResponse<"/v1/manufacturers/list">>(
    "/internal/devicedb/v1/manufacturers/list",
  )
  t.is(status, 200)
  t.is(data.manufacturers.length, 1)
})

test("GET /internal/devicedb/v1/manufacturers/get", async (t) => {
  const { axios, get, db } = await getTestServer(t, { seed: false })
  const { seam_apikey1_token } = seedDatabase(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const {
    data: { manufacturers },
  } = await get<RouteResponse<"/v1/manufacturers/list">>(
    "/internal/devicedb/v1/manufacturers/list",
  )

  const manufacturer_id = manufacturers[0]?.manufacturer_id

  if (manufacturer_id == null) {
    t.fail("No devices models")
    return
  }

  const { data, status } = await get<RouteResponse<"/v1/manufacturers/get">>(
    "/internal/devicedb/v1/manufacturers/get",
    { params: { manufacturer_id } },
  )
  t.is(status, 200)
  t.is(data.manufacturer.manufacturer_id, manufacturer_id)
})

test("GET /internal/devicedb/v1/device_models/list (with client session token)", async (t) => {
  const { axios, get, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seedDatabase(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`
  const { data, status } = await get<RouteResponse<"/v1/device_models/list">>(
    "/internal/devicedb/v1/device_models/list",
  )
  t.is(status, 200)
  t.is(data.device_models.length, 1)
})
