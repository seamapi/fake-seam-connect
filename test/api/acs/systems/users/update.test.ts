import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/users/update", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { acs_system1_id: acs_system_id } = seed.ws2

  const full_name = "ex jane name"
  const email = "jane@ex.com"

  const {
    data: {
      acs_user: { acs_user_id },
    },
  } = await axios.post(
    "/acs/users/create",
    {
      acs_system_id,
      full_name,
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { acs_user: created_user },
  } = await axios.get("/acs/users/get", {
    data: {
      acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(created_user.full_name, full_name)
  t.is(created_user.email, email)

  const updated_name = "new jane name"
  const updated_number = "+551155256325"
  const access_schedule = {
    starts_at: new Date().toISOString(),
    ends_at: new Date().toISOString(),
  }

  await axios.post(
    "/acs/users/update",
    {
      acs_user_id,
      full_name: updated_name,
      phone_number: updated_number,
      access_schedule,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { acs_user: updated_user },
  } = await axios.get("/acs/users/get", {
    data: {
      acs_user_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(updated_user.full_name, updated_name)
  t.is(updated_user.email, email)
  t.is(updated_user.phone_number, updated_number)
  t.is(updated_user.access_schedule?.starts_at, access_schedule.starts_at)
  t.is(updated_user.access_schedule?.ends_at, access_schedule.ends_at)
})
