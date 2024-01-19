import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /connected_accounts/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { connected_account1_id: connected_account_id } = seed.ws2

  const {
    data: { connected_account },
  } = await axios.get("/connected_accounts/get", {
    data: {
      connected_account_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(connected_account.automatically_manage_new_devices, true)
  t.falsy(connected_account.custom_metadata)

  await axios.post(
    "/connected_accounts/update",
    {
      connected_account_id,
      automatically_manage_new_devices: false,
      custom_metadata: {
        foo: "bar",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { connected_account: updated_connected_account },
  } = await axios.get("/connected_accounts/get", {
    data: {
      connected_account_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(updated_connected_account.automatically_manage_new_devices, false)
  t.deepEqual(updated_connected_account.custom_metadata, {
    foo: "bar",
  })
})
