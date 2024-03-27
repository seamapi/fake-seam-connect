import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /webhooks/list", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  await axios.post(
    "/webhooks/create",
    {
      url: "https://test-url.com",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  let webhooks_list_res = await axios.get("/webhooks/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(webhooks_list_res.data.webhooks.length, 1)

  await axios.post(
    "/webhooks/create",
    {
      url: "https://test-url-2.com",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  webhooks_list_res = await axios.get("/webhooks/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.is(webhooks_list_res.data.webhooks.length, 2)
})
