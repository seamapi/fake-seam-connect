import test, { type ExecutionContext } from "ava"
import ms from "ms"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/create", async (t: ExecutionContext) => {
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
    },
  )

  t.is(access_code.code, "1234")

  // Test 409 response (duplicate code)
  const create_duplicate_code_res = await axios.post(
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
      validateStatus: () => true,
    },
  )

  t.is(create_duplicate_code_res.status, 409)
  t.is(
    (create_duplicate_code_res.data as any).error.type,
    "duplicate_access_code",
  )

  const res = await axios.get("/access_codes/get", {
    params: {
      access_code_id: access_code.access_code_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(res.data.access_code.code, "1234")

  await axios.post(
    "/access_codes/create",
    {
      device_id,
      name: "Test Access Code",
      code: "5678",
      starts_at: new Date(),
      ends_at: new Date(Date.now() + ms("1d")),
      use_backup_access_code_pool: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )
  const backup_codes = db.access_codes.filter(
    (ac) => (ac.is_backup ?? false) && ac.device_id === device_id,
  )
  t.is(backup_codes.length, 1)

  const {
    data: { access_codes: access_code_list },
  } = await axios.post(
    "/access_codes/list",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )
  // backup codes are not included
  t.is(access_code_list.length, 2)
})
