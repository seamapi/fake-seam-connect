import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/users/suspend", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_user1_id } = seed.ws2

  async function checkUserSuspensionStatus(
    acs_user_id: string,
  ): Promise<boolean> {
    const res = await axios.get("/acs/users/get", {
      params: { acs_user_id },
      headers: { Authorization: `Bearer ${seed.ws2.cst}` },
    })
    return res.data.acs_user.is_suspended
  }

  t.false(await checkUserSuspensionStatus(acs_user1_id))

  await axios.post(
    "/acs/users/suspend",
    { acs_user_id: acs_user1_id },
    { headers: { Authorization: `Bearer ${seed.ws2.cst}` } },
  )
  t.true(await checkUserSuspensionStatus(acs_user1_id))

  await axios.post(
    "/acs/users/unsuspend",
    { acs_user_id: acs_user1_id },
    { headers: { Authorization: `Bearer ${seed.ws2.cst}` } },
  )
  t.false(await checkUserSuspensionStatus(acs_user1_id))

  const non_existent_user_res = await axios.post(
    "/acs/users/unsuspend",
    { acs_user_id: "non_existent_acs_user_id" },
    {
      headers: { Authorization: `Bearer ${seed.ws2.cst}` },
      validateStatus: () => true,
    },
  )

  t.is(non_existent_user_res.status, 404)
})
