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

  // status: success
  await axios.patch("/_fake/update_action_attempt", {
    action_attempt_id,
    status: "success",
    result: {},
  })

  let updated_action_attempt = db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  t.truthy(updated_action_attempt)
  t.is(updated_action_attempt?.status, "success")
  t.deepEqual(updated_action_attempt?.result, {})

  // status: error
  const action_attempt_error = { message: "error message", type: "error type" }

  await axios.patch("/_fake/update_action_attempt", {
    action_attempt_id,
    status: "error",
    error: action_attempt_error,
  })

  updated_action_attempt = db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  t.is(updated_action_attempt?.status, "error")
  t.deepEqual(updated_action_attempt?.error, action_attempt_error)
  t.deepEqual(updated_action_attempt?.result, null)

  // status: pending
  await axios.patch("/_fake/update_action_attempt", {
    action_attempt_id,
    status: "pending",
  })

  updated_action_attempt = db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  t.is(updated_action_attempt?.status, "pending")
  t.deepEqual(updated_action_attempt?.result, null)
  t.deepEqual(updated_action_attempt?.error, null)
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
