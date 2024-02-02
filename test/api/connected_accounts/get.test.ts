import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /connected_accounts/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { connected_account1_id: connected_account_id } = seed.ws2
  const connected_account_email = "john@example.com"

  let connected_account_get_res = await axios.get("/connected_accounts/get", {
    data: {
      connected_account_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(
    connected_account_get_res.data.connected_account.connected_account_id,
    connected_account_id,
  )

  connected_account_get_res = await axios.get("/connected_accounts/get", {
    data: {
      email: connected_account_email,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(
    connected_account_get_res.data.connected_account.user_identifier.email,
    connected_account_email,
  )
})
