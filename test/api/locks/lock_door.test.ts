import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /locks/lock_door", async (t) => {
  const { axios, db, seed } = await getTestServer(t)

  const device = db.devices.find(
    (d) => d.workspace_id === seed.ws2.workspace_id,
  )

  if (device == null) {
    t.fail("Expected at least one device in ws2")
    return
  }

  const {
    data: { action_attempt },
  } = await axios.post(
    "/locks/lock_door",
    {
      device_id: device.device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(action_attempt.status, "pending")
  t.is(action_attempt.action_type, "LOCK_DOOR")
  t.is(action_attempt.error, null)
  t.is(action_attempt.result, null)

  const action_attempt_finished = db.findActionAttempt(action_attempt)

  if (action_attempt_finished == null) {
    t.fail("Expected action attempt to be found")
    return
  }

  t.is(action_attempt_finished.status, "success")
})

test("POST /locks/lock_door (sync)", async (t) => {
  const { axios, db, seed } = await getTestServer(t)

  const device = db.devices.find(
    (d) => d.workspace_id === seed.ws2.workspace_id,
  )

  if (device == null) {
    t.fail("Expected at least one device in ws2")
    return
  }

  const {
    data: { action_attempt },
  } = await axios.post(
    "/locks/lock_door",
    {
      device_id: device.device_id,
      sync: true,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(action_attempt.status, "success")
  t.is(action_attempt.action_type, "LOCK_DOOR")
  t.is(action_attempt.error, null)
  t.is(action_attempt.result, null)
})
