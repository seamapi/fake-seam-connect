import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/create_multiple", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device1_id = seed.ws2.device1_id
  const device2_id = seed.ws2.device2_id

  const {
    data: { access_codes },
  } = await axios.post(
    "/access_codes/create_multiple",
    {
      device_ids: [device1_id, device2_id],
      name: "Test Create Multiple Access Codes",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(access_codes.length, 2)
  t.is(access_codes[0]?.code, access_codes[1]?.code)
})
