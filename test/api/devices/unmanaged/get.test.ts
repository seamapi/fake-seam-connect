import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /devices/unmanaged/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  let unmanaged_devices_get_res = await axios.get("/devices/unmanaged/get", {
    params: {
      device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })
  t.is(unmanaged_devices_get_res.status, 404)

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
    }
  )

  unmanaged_devices_get_res = await axios.get("/devices/unmanaged/get", {
    params: {
      device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(unmanaged_devices_get_res.status, 200)
  t.is(unmanaged_devices_get_res.data.device.device_id, device_id)
})
