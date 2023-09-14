import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /internal/tlmtry", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { status } = await axios.post("/internal/tlmtry", { type: "identify" })
  t.is(status, 204)
})
