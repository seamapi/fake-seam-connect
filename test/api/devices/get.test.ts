import test, { ExecutionContext } from "ava"
import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /devices/get with access token auth", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)

  const {
    data: { device },
  } = await axios.get("/devices/get", {
    params: {
      device_id: seed.ws2.device1_id
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
      "seam-workspace": seed.ws2.workspace_id,
    },
  })

  t.is(device.device_id, seed.ws2.device1_id)
})
