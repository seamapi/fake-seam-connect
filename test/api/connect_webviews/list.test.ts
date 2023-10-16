import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /connect_webviews/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { connect_webviews },
  } = await axios.get("/connect_webviews/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(connect_webviews.length, 1)
})
