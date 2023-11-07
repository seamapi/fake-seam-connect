import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("response contains request id header", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { status, headers } = await axios.get("/health")
  t.is(status, 200)
  t.is(headers["seam-request-id"], "request1")
})
