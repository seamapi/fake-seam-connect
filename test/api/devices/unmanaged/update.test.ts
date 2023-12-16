import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("PATCH /devices/unmanaged/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

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

  let devices_unmanaged_get_res = await axios.get("/devices/unmanaged/get", {
    params: { device_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.truthy(devices_unmanaged_get_res.data.device)

  await axios.patch(
    "/devices/unmanaged/update",
    {
      device_id,
      is_managed: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  devices_unmanaged_get_res = await axios.get("/devices/unmanaged/get", {
    params: { device_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })
  t.is(devices_unmanaged_get_res.status, 404)
})
