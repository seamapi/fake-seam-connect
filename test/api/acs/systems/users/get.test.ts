import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/users/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_user1_id: acs_user_id } = seed.ws2

  const {
    data: { acs_user },
  } = await axios.get("/acs/users/get", {
    data: {
      acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_user.acs_user_id, acs_user_id)
})
