import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("GET /_fake/default_seed", async (t: ExecutionContext) => {
  const { axios } = await getTestServer(t)

  const { data } = await axios.get("/_fake/default_seed")
  const { ok, ...data_without_ok } = data

  t.deepEqual(data_without_ok, seed)
})
