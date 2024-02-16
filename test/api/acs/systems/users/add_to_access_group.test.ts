import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/users/add_to_access_group", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  axios.defaults.headers.common.Authorization = `Bearer ${seed.ws2.cst}`
  const {
    acs_user1_id: acs_user_id,
    acs_access_group1_id: acs_access_group_id,
  } = seed.ws2

  let access_group = db.acs_access_groups.find(
    (ag) => ag.acs_access_group_id === acs_access_group_id,
  )
  t.false(access_group?._acs_user_ids.includes(acs_user_id))

  await axios.post("/acs/users/add_to_access_group", {
    acs_user_id,
    acs_access_group_id,
  })

  access_group = db.acs_access_groups.find(
    (ag) => ag.acs_access_group_id === acs_access_group_id,
  )
  t.true(access_group?._acs_user_ids.includes(acs_user_id))
})
