import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /action_attempts/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: {
      action_attempt: { action_attempt_id: lock_door_action_attempt_id },
    },
  } = await axios.post(
    "/locks/lock_door",
    {
      device_id: seed.ws2.device1_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )
  const {
    data: {
      action_attempt: { action_attempt_id: unlock_door_action_attempt_id },
    },
  } = await axios.post(
    "/locks/unlock_door",
    {
      device_id: seed.ws2.device1_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  const {
    data: { action_attempts: list_action_attempts },
  } = await axios.get("/action_attempts/list", {
    params: {
      action_attempt_ids: [
        lock_door_action_attempt_id,
        unlock_door_action_attempt_id,
      ],
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(list_action_attempts.length, 2)
  t.true(
    list_action_attempts.every(({ action_attempt_id }) =>
      [lock_door_action_attempt_id, unlock_door_action_attempt_id].includes(
        action_attempt_id
      )
    )
  )
})
