import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /webhooks/get", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
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

  const {
    data: { webhook: get_res_webhook },
  } = await axios.get("/webhooks/get", {
    params: {
      webhook_id: webhook.webhook_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.truthy(get_res_webhook)
  t.is(get_res_webhook.webhook_id, webhook.webhook_id)
})
