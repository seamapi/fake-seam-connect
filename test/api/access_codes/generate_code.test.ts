import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /access_codes/generate_code", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  const {
    data: { generated_code },
  } = await axios.post(
    "/access_codes/generate_code",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(generated_code.device_id, seed.ws2.device1_id)
  t.true(generated_code.code.length >= 4)
  t.true(generated_code.code.length <= 6)
})
