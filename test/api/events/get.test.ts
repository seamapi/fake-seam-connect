import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /events/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const { device1_id: device_id } = seed.ws2

  await axios.post(
    "/access_codes/create",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  // Test 200 response (device_id)
  let events_get_request = await axios.get("/events/get", {
    params: {
      device_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(events_get_request.data.event)
  t.is(events_get_request.data.event.device_id, device_id)

  // Test 200 response (event_type)
  events_get_request = await axios.get("/events/get", {
    params: {
      event_type: "access_code.created",
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(events_get_request.data.event)
  t.is(events_get_request.data.event.event_type, "access_code.created")

  // Test 200 response (event_id)
  const { event_id } = events_get_request.data.event
  events_get_request = await axios.get("/events/get", {
    params: {
      event_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(events_get_request.data.event)
  t.is(events_get_request.data.event.event_id, event_id)
})
