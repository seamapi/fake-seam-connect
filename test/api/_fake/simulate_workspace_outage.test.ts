import test, { type ExecutionContext } from "ava"

import { SimpleAxiosError, getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("POST /_fake/simulate_outage", async (t: ExecutionContext) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  await axios.post("/_fake/simulate_workspace_outage", {
    workspace_id: seed_result.seed_workspace_1,
    routes: ["/devices/list"],
  })

  const err = await t.throwsAsync<SimpleAxiosError>(
    async () =>
      await axios.get("/devices/list", {
        params: { device_ids: ["123"] },
        headers: {
          Authorization: `Bearer ${seed_result.seam_apikey1_token}`,
        },
      }),
  )
  t.is(err?.status, 503)
})
