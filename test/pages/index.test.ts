import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /", async (t: ExecutionContext) => {
  const { get } = await getTestServer(t)
  const { data } = await get("/")
  t.true(data.includes("Seam API"))
})
