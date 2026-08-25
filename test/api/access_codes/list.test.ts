import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

const createAccessCodes = async (
  axios: Awaited<ReturnType<typeof getTestServer>>["axios"],
  device_id: string,
  cst: string,
  count: number,
): Promise<void> => {
  for (let i = 0; i < count; i++) {
    await axios.post(
      "/access_codes/create",
      { device_id, name: `Test Access Code ${i}`, code: `100${i}` },
      { headers: { Authorization: `Bearer ${cst}` } },
    )
  }
}

test("GET /access_codes/list returns pagination", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  axios.defaults.headers.common.Authorization = `Bearer ${seed.ws2.cst}`

  await createAccessCodes(axios, device_id, seed.ws2.cst, 3)

  const {
    data: {
      access_codes,
      pagination: { has_next_page, next_page_cursor, next_page_url },
    },
  } = await axios.get("/access_codes/list", { params: { device_id } })

  t.is(access_codes.length, 3)
  t.false(has_next_page)
  t.is(next_page_cursor, null)
  t.is(next_page_url, null)
})

test("GET /access_codes/list with pages", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  axios.defaults.headers.common.Authorization = `Bearer ${seed.ws2.cst}`

  await createAccessCodes(axios, device_id, seed.ws2.cst, 3)

  const params = { device_id, limit: 2 }

  const {
    data: { access_codes },
  } = await axios.get("/access_codes/list", { params: { device_id } })

  const {
    data: {
      access_codes: page1,
      pagination: {
        has_next_page: has_page_2,
        next_page_cursor: page2_cursor,
        next_page_url: page2_url,
      },
    },
  } = await axios.get("/access_codes/list", { params })

  t.is(page1.length, 2)
  t.true(has_page_2)
  t.truthy(page2_cursor)
  t.deepEqual(page1, [access_codes[0], access_codes[1]])

  if (page2_url == null) {
    t.fail("Null next_page_url")
    return
  }

  const url = new URL(page2_url)
  t.is(url.pathname, "/access_codes/list")
  t.deepEqual(url.searchParams.getAll("limit"), ["2"])

  const {
    data: {
      access_codes: page2,
      pagination: { has_next_page: has_page_3, next_page_cursor: page3_cursor },
    },
  } = await axios.get("/access_codes/list", {
    params: { ...params, page_cursor: page2_cursor },
  })

  t.is(page2.length, 1)
  t.false(has_page_3)
  t.is(page3_cursor, null)
  t.deepEqual(page2, [access_codes[2]])
})

test("GET /access_codes/list rejects a cursor from different parameters", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  axios.defaults.headers.common.Authorization = `Bearer ${seed.ws2.cst}`

  await createAccessCodes(axios, device_id, seed.ws2.cst, 3)

  const {
    data: {
      pagination: { next_page_cursor },
    },
  } = await axios.get("/access_codes/list", { params: { device_id, limit: 2 } })

  const res = await axios.get("/access_codes/list", {
    params: { device_id, limit: 1, page_cursor: next_page_cursor },
    validateStatus: () => true,
  })

  t.is(res.status, 400)
  t.is(res.data.error.type, "mismatched_page_parameters")
})
