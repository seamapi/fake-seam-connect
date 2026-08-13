import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("GET /internal/device_models/list", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.get("/internal/device_models/list")
  t.true(data.device_models.length > 0)
})

test("POST /internal/device_models/list", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)
  const { data } = await axios.post("/internal/device_models/list", {
    brand: "yale",
  })
  t.true(data.device_models.length > 0)
  t.true(
    data.device_models.every((dm: { brand: string }) => dm.brand === "yale"),
  )
})
