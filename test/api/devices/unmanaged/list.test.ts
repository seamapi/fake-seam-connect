import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /devices/unmanaged/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  let unmanaged_devices_list_res = await axios.get("/devices/unmanaged/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.is(unmanaged_devices_list_res.status, 200)
  t.true(unmanaged_devices_list_res.data.devices.length === 0)

  await axios.patch(
    "/devices/update",
    {
      device_id,
      is_managed: false,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  unmanaged_devices_list_res = await axios.get("/devices/unmanaged/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(unmanaged_devices_list_res.status, 200)
  t.true(unmanaged_devices_list_res.data.devices.length === 1)
  t.is(unmanaged_devices_list_res.data.devices[0]?.device_id, device_id)
})
