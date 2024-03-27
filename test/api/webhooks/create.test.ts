import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { SEAM_EVENT_LIST } from "lib/constants.ts"

test("POST /webhooks/create", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
  const webhook_url = "https://test-url.com"
  const {
    data: { webhook },
  } = await axios.post(
    "/webhooks/create",
    {
      url: webhook_url,
      event_types: ["device.connected"],
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(webhook.event_types?.length, 1)
  t.is(webhook.event_types?.[0], "device.connected")
  t.is(webhook.url, webhook_url)
  t.truthy(db.webhooks.find((w) => w.webhook_id === webhook.webhook_id))

  const {
    data: { webhook: webhook_with_all_events },
  } = await axios.post(
    "/webhooks/create",
    {
      url: webhook_url,
      event_types: ["*"],
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(webhook_with_all_events?.event_types?.length, SEAM_EVENT_LIST.length)

  // Test 400 response (invalid event type)
  const create_invalid_webhook_res = await axios.post(
    "/webhooks/create",
    {
      url: webhook_url,
      event_types: ["invalid.event"],
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
      validateStatus: () => true,
    },
  )

  t.is(create_invalid_webhook_res.status, 400)
  t.is(
    (create_invalid_webhook_res.data as any).error.type,
    "invalid_event_types",
  )
})
