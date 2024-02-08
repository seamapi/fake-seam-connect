import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /health", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/health")
  t.true(data.ok)
  t.true(data.service_health_statuses.length > 0)
  t.is(data.service_health_statuses[0]?.status, "healthy")
})

test("POST /health", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.post("/health", {})
  t.true(data.ok)
})

test("GET /health/get_health", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/health/get_health")
  t.true(data.ok)
  t.true(data.service_health_statuses.length > 0)
  t.is(data.service_health_statuses[0]?.status, "healthy")
})
