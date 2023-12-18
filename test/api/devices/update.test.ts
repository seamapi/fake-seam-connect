import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("PATCH /devices/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  const updated_name = "Some new test device name"

  await axios.patch(
    "/devices/update",
    {
      device_id,
      name: updated_name,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { device },
  } = await axios.get("/devices/get", {
    params: {
      device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(device.properties.name, updated_name)
})
