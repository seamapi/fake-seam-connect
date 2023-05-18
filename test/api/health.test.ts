import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"

test("GET /health", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/health")
  t.true(data.ok)
  t.truthy(data.note)
})

// Example of testing API error.
test("GET /", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const err = await t.throwsAsync<SimpleAxiosError>(
    // @ts-expect-error Testing a 404 so the route does not exist in route-types.
    async () => await axios.get("/")
  )
  t.is(err?.status, 404)
})

test("GET /health with CORS", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const health_res = await axios.options("/health" as never)

  t.is(health_res.status, 200)
  t.is(health_res.headers["access-control-allow-origin"], "*")
})
