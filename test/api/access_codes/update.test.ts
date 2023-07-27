import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  const {
    data: { access_code },
  } = await axios.post(
    "/access_codes/create",
    {
      device_id,
      name: "Test Access Code",
      code: "1234",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(access_code.code, "1234")

  const res = await axios.post(
    "/access_codes/update",
    {
      access_code_id: access_code.access_code_id,
      name: "Updated Code",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(res.data.access_code.name, "Updated Code")
})
