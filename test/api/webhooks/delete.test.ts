import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /webhooks/delete", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { webhook },
  } = await axios.post(
    "/webhooks/create",
    {
      url: "https://test-url.com",
      event_types: ["device.connected"],
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  let webhooks_get_res = await axios.get("/webhooks/get", {
    params: { webhook_id: webhook.webhook_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(webhooks_get_res.status, 200)

  await axios.delete("/webhooks/delete", {
    data: {
      webhook_id: webhook.webhook_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  webhooks_get_res = await axios.get("/webhooks/get", {
    params: { webhook_id: webhook.webhook_id },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(webhooks_get_res.status, 404)
})
