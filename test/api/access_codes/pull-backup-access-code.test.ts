import test, { type ExecutionContext } from "ava"
import ms from "ms"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /access_codes/pull_backup_access_code", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const device_id = seed.ws2.device1_id

  const {
    data: {
      access_code: { access_code_id },
    },
  } = await axios.post(
    "/access_codes/create",
    {
      device_id,
      name: "Test Access Code",
      code: "3333",
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

  const {
    data: { backup_access_code },
  } = await axios.post(
    "/access_codes/pull_backup_access_code",
    {
      access_code_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )
  const original_access_code = db.access_codes.find(
    (ac) => ac.access_code_id === access_code_id,
  )
  t.is(backup_access_code.device_id, device_id)
  t.is(
    original_access_code?.pulled_backup_access_code_id,
    backup_access_code.access_code_id,
  )
})
