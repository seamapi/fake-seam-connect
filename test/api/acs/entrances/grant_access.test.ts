import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /acs/entrances/grant_access", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const { acs_user1_id: acs_user_id, acs_entrance1_id: acs_entrance_id } =
    seed.ws2

  const getAcsEntranceFromDb = () =>
    db.acs_entrances.find((e) => e.acs_entrance_id === acs_entrance_id)

  t.false(getAcsEntranceFromDb()?._acs_user_ids.includes(acs_user_id))

  await axios.post(
    "/acs/entrances/grant_access",
    {
      acs_user_id,
      acs_entrance_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.true(getAcsEntranceFromDb()?._acs_user_ids.includes(acs_user_id))
})
