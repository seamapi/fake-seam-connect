import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/unmanaged/update", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
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
    },
  )

  t.is(access_code.is_managed, false)

  await axios.post(
    "/access_codes/unmanaged/update",
    {
      access_code_id: access_code.access_code_id,
      is_managed: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const updated_access_code = db.access_codes.find(
    (ac) => ac.access_code_id === access_code.access_code_id,
  )

  t.is(updated_access_code?.is_managed, true)
})
