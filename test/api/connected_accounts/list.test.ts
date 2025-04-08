import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("GET /connected_accounts/list with limit", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: { connected_accounts },
  } = await axios.get("/connected_accounts/list", { params: { limit: 1 } })

  t.is(connected_accounts.length, 1)
})

test("GET /connected_accounts/list with pages", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  const params = { limit: 2 }

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: {
      connected_accounts,
      pagination: { has_next_page, next_page_cursor, next_page_url },
    },
  } = await axios.get("/connected_accounts/list")
  t.false(has_next_page)
  t.is(next_page_cursor, null)
  t.is(next_page_url, null)
  t.is(connected_accounts.length, 3)

  const {
    data: {
      connected_accounts: page1,
      pagination: {
        has_next_page: has_page_2,
        next_page_cursor: page2_cursor,
        next_page_url: page2_url,
      },
    },
  } = await axios.get("/connected_accounts/list", { params })

  t.is(page1.length, 2)
  t.true(has_page_2)
  t.truthy(page2_cursor)

  if (page2_url == null) {
    t.fail("Null next_page_url")
    return
  }

  const url = new URL(page2_url)
  t.is(url.pathname, "/connected_accounts/list")
  t.deepEqual(url.searchParams.getAll("limit"), ["2"])

  t.deepEqual(page1, [connected_accounts[0], connected_accounts[1]])

  const {
    data: {
      connected_accounts: page2,
      pagination: { has_next_page: has_page_3, next_page_cursor: page3_cursor },
    },
  } = await axios.get("/connected_accounts/list", {
    params: { ...params, page_cursor: page2_cursor },
  })
  t.is(page2.length, 1)
  t.false(has_page_3)
  t.is(page3_cursor, null)

  t.deepEqual(page2, [connected_accounts[2]])
})

test("GET /connected_accounts/list validates query hash", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  axios.defaults.headers.common.Authorization = `Bearer ${seed_result.seam_apikey1_token}`

  const {
    data: {
      pagination: { has_next_page, next_page_cursor },
    },
  } = await axios.get("/connected_accounts/list", { params: { limit: 2 } })

  t.true(has_next_page)

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/connected_accounts/list", {
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
      await axios.get("/connected_accounts/list", {
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
      await axios.post("/connected_accounts/list", {
        limit: 3,
        page_cursor: next_page_cursor,
      }),
  )
  t.is(err_post?.status, 400)
  t.regex(
    (err_post?.response?.error?.message as string) ?? "",
    /parameters identical/,
  )
})
