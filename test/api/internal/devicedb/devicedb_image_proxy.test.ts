import type { RouteResponse } from "@seamapi/types/devicedb"
import test from "ava"
import httpClient, { type Axios } from "axios"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("GET /internal/devicedb_image_proxy", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_apikey1_token } = seed(db)
  axios.defaults.headers.common.Authorization = `Bearer ${seam_apikey1_token}`

  const {
    data: { device_models },
  } = await (axios as Axios).get<RouteResponse<"/v1/device_models/list">>(
    "/internal/devicedb/v1/device_models/list"
  )

  const image_url = device_models[0]?.aesthetic_variants[0]?.front_image?.url

  if (image_url == null) {
    t.fail("No image url")
    return
  }

  const { status, data, headers } = await httpClient.get(image_url)
  t.is(status, 200)
  t.truthy(data)
  t.is(headers["content-type"], "image/png")
})

test("GET /internal/devicedb_image_proxy (404)", async (t) => {
  const { axios } = await getTestServer(t)
  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/internal/devicedb_image_proxy", {
        params: { image_id: "00000000-0000-0000-4242-000000000000" },
      })
  )
  t.is(err?.status, 404)
})
