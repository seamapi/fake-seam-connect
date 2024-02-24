import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/users/suspend", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const acs_user_id = seed.ws2.acs_user1_id
  const auth_header = { Authorization: `Bearer ${seed.ws2.cst}` }

  async function checkUserSuspensionStatus(
    acs_user_id: string,
  ): Promise<boolean> {
    const response = await axios.get("/acs/users/get", {
      params: { acs_user_id },
      headers: auth_header,
    })
    return response.data.acs_user.is_suspended
  }

  t.false(await checkUserSuspensionStatus(acs_user_id))

  await axios.post(
    "/acs/users/suspend",
    { acs_user_id },
    { headers: auth_header },
  )

  t.true(await checkUserSuspensionStatus(acs_user_id))

  const non_existent_user_res = await axios.post(
    "/acs/users/suspend",
    { acs_user_id: "non_existent_user" },
    { headers: auth_header, validateStatus: () => true },
  )

  t.is(non_existent_user_res.status, 404)
})
