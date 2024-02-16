import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /acs/users/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  const {
    data: { acs_users },
  } = await axios.get("/acs/users/list", {
    data: {
      acs_system_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_users.length, 1)
})

test("GET /acs/users/list - by user identity", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  const user_identity = db.addUserIdentity({
    full_name: "jane example",
    workspace_id: seed.ws2.workspace_id,
  })

  const {
    data: { acs_users },
  } = await axios.get("/acs/users/list", {
    params: { user_identity_id: user_identity.user_identity_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(acs_users.length, 0)

  const {
    data: { acs_user },
  } = await axios.post(
    "/acs/users/create",
    {
      acs_system_id,
      full_name: "acs_user_jane",
      user_identity_id: user_identity.user_identity_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { acs_users: added_user_acs_users },
  } = await axios.get("/acs/users/list", {
    params: { user_identity_id: user_identity.user_identity_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(added_user_acs_users.length, 1)
  t.is(added_user_acs_users[0]?.acs_user_id, acs_user.acs_user_id)
})
