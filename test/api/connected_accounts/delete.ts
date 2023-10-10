import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("DELETE /connected_accounts/delete", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { connected_account1_id: connected_account_id, device1_id: device_id } =
    seed.ws2

  await axios.delete("/connected_accounts/delete", {
    data: {
      connected_account_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  const connected_accounts_get_res = await axios.get(
    "/connected_accounts/get",
    {
      params: {
        connected_account_id,
      },
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
      validateStatus: () => true,
    }
  )

  t.is(connected_accounts_get_res.status, 404)

  const devices_get_res = await axios.get("/devices/get", {
    params: {
      device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(devices_get_res.status, 404)
})
