import test, { type ExecutionContext } from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"

test("PATCH /_fake/update_action_attempt", async (t: ExecutionContext) => {
  const { axios, db, seed } = await getTestServer(t)

  const {
    data: {
      action_attempt: { action_attempt_id },
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
    },
  )

  const payload = {
    action_attempt_id,
    status: "success" as const,
    result: {},
  }

  const { status } = await axios.patch("/_fake/update_action_attempt", payload)

  t.is(status, 200)

  const updated_action_attempt = db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  t.truthy(updated_action_attempt)
  t.is(updated_action_attempt?.status, "success")
  t.deepEqual(updated_action_attempt?.result, {})
})

test("PATCH /_fake/update_action_attempt - invalid action_attempt_id", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)

  const payload = {
    action_attempt_id: "non-existent-action-attempt-id",
    status: "success" as const,
    result: {},
  }

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () => await axios.patch("/_fake/update_action_attempt", payload),
  )

  t.is(err?.status, 404)
})
