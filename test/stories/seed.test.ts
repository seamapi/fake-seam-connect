import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("seed database should work", async (t) => {
  const { db } = await getTestServer(t, { seed: false })
  t.notThrows(() => {
    seed(db)
  })
})
