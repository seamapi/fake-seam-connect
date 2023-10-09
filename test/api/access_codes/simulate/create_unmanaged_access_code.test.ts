import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/simulate/create_unmanaged_access_code", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  const {
    data: { access_code },
  } = await axios.post(
    "/access_codes/simulate/create_unmanaged_access_code",
    {
      device_id,
      name: "Test Simulated Unmanaged Access Code",
      code: "3333",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(access_code.code, "3333")
  t.is(access_code.is_managed, false)
})
