import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("DELETE /access_codes/delete", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
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

  const res = await axios.delete(
    "/access_codes/delete",
    {
      data: {
        access_code_id: access_code.access_code_id,
      },
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      }
      },
    }
  )

  t.is(res.status, 200)

  const deleted = db.findAccessCode({
    access_code_id: access_code.access_code_id,
  })

  t.falsy(deleted) // removed from db
})
