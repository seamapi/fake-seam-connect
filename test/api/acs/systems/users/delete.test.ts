import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("DELETE /acs/users/delete", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_user1_id: acs_user_id } = seed.ws2

  // Test 200 response
  let acs_users_delete_res = await axios.delete("/acs/users/delete", {
    data: {
      acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_users_delete_res.status, 200)

  const acs_users_get_res = await axios.get("/acs/users/get", {
    data: {
      acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(acs_users_get_res.status, 404)

  // Test 404 response (acs_user not found)
  acs_users_delete_res = await axios.delete("/acs/users/delete", {
    data: {
      acs_user_id: "some_acs_user_id",
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(acs_users_delete_res.status, 404)
})
