import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /action_attempts/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { action_attempt: lock_door_action_attempt },
  } = await axios.post(
    "/locks/lock_door",
    {
      device_id: seed.ws2.device1_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  const {
    data: { action_attempt: get_res_action_attempt },
  } = await axios.get("/action_attempts/get", {
    params: {
      action_attempt_id: lock_door_action_attempt.action_attempt_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(get_res_action_attempt)
  t.is(
    get_res_action_attempt.action_attempt_id,
    lock_door_action_attempt.action_attempt_id,
  )
})
