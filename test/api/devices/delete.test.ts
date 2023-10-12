import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /devices/delete", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  const {
    data: { access_code },
  } = await axios.post(
    "/access_codes/create",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  const devices_delete_res = await axios.delete("/devices/delete", {
    data: { device_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(devices_delete_res.status, 200)

  const devices_get_res = await axios.get("/devices/get", {
    params: { device_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(devices_get_res.status, 404)

  const access_codes_get_res = await axios.get("/access_codes/get", {
    params: { access_code_id: access_code!.access_code_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(access_codes_get_res.status, 404)
})
