import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /events/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    device1_id: device_id,
    device2_id,
    connected_account1_id: connected_account_id,
  } = seed.ws2
  const date_before_event_happened = new Date().toISOString()

  const {
    data: { access_code: created_access_code },
  } = await axios.post(
    "/access_codes/create",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )
  await axios.post(
    "/access_codes/create",
    {
      device_id: device2_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  // Test 200 response (since)
  let events_list_request = await axios.get("/events/list", {
    params: {
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 2)
  t.true(
    new Date(events_list_request.data.events[0]?.created_at ?? "") >
      new Date(date_before_event_happened)
  )

  events_list_request = await axios.get("/events/list", {
    params: {
      since: new Date().toISOString(),
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 0)

  // Test 200 response (between)
  events_list_request = await axios.get("/events/list", {
    params: {
      between: [date_before_event_happened, new Date().toISOString()],
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 2)

  // Test 200 response (device_id)
  events_list_request = await axios.get("/events/list", {
    params: {
      device_id,
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 1)
  t.is(events_list_request.data.events[0]?.device_id, device_id)

  // Test 200 response (device_ids)
  events_list_request = await axios.get("/events/list", {
    params: {
      device_ids: [device_id],
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.is(events_list_request.data.events.length, 1)

  // Test 200 response (empty device_ids)
  events_list_request = await axios.get("/events/list", {
    params: {
      device_ids: [],
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.is(events_list_request.data.events.length, 0)

  // Test 200 response (access_code_ids)
  events_list_request = await axios.get("/events/list", {
    params: {
      access_code_ids: [created_access_code.access_code_id],
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 1)
  t.is(
    events_list_request.data.events[0]?.access_code_id,
    created_access_code.access_code_id
  )

  // Test 200 response (empty access_code_ids)
  events_list_request = await axios.get("/events/list", {
    params: {
      access_code_ids: [],
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.is(events_list_request.data.events.length, 0)

  // Test 200 response (event_type)
  events_list_request = await axios.get("/events/list", {
    params: {
      event_type: "access_code.created",
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 2)

  // Test 200 response (connected_account_id)
  events_list_request = await axios.get("/events/list", {
    params: {
      connected_account_id,
      since: date_before_event_happened,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })
  t.true(events_list_request.data.events.length === 2)
})
