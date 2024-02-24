import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/users/create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  await axios.post(
    "/acs/users/create",
    {
      acs_system_id,
      full_name: "jane doe",
    },g
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

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

  t.is(acs_users.length, 2) // seed + jane doe
  t.true(acs_users.some((u) => u.full_name === "jane doe"))
})

test("POST /acs/users/create (with access_group_id)", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const {
    acs_system1_id: acs_system_id,
    acs_access_group1_id: acs_access_group_id,
  } = seed.ws2

  const {
    data: { acs_user },
  } = await axios.post(
    "/acs/users/create",
    {
      acs_system_id,
      full_name: "jane doe",
      acs_access_group_ids: [acs_access_group_id],
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  // TODO: call /access_groups/list and check if the user is in the group
  t.true(
    db.acs_access_groups.some(
      (u) =>
        u.acs_access_group_id === acs_access_group_id &&
        u._acs_user_ids.includes(acs_user.acs_user_id),
    ),
  )
})

test("POST /acs/users/create (with access schedule)", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  const {
    data: { acs_user: created_acs_user },
  } = await axios.post(
    "/acs/users/create",
    {
      acs_system_id,
      full_name: "jane doe",
      access_schedule: {
        starts_at: new Date().toISOString(),
        ends_at: new Date().toISOString(),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { acs_user },
  } = await axios.get("/acs/users/get", {
    params: {
      acs_user_id: created_acs_user.acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(acs_user.access_schedule?.starts_at)
  t.truthy(acs_user.access_schedule?.ends_at)
})
