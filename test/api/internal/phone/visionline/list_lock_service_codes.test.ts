import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /internal/phone/visionline/list_lock_service_codes", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seed(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const { data, status } = await axios.post(
    "/internal/phone/visionline/list_lock_service_codes",
    {}
  )

  t.is(status, 200)
  t.deepEqual(data.list_lock_service_codes_response.lock_service_codes, [1])
})
