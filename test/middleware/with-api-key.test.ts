import test from "ava"
import jwt from "jsonwebtoken"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("withApiKey middleware - successful auth", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  // Test successful auth with API key
  const { status } = await axios.get("/devices/list", {
    headers: {
      Authorization: `Bearer ${seed_result.seam_apikey1_token}`,
    },
  })
  t.is(status, 200)

  // Test missing Authorization header
  const missingAuthErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/list"),
  )

  t.is(missingAuthErr?.status, 401)
  t.is(missingAuthErr?.response.error.type, "unauthorized")

  // Test invalid API key
  const invalidKeyErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/list", {
      headers: {
        Authorization: "Bearer invalid_api_key",
      },
    }),
  )

  t.is(invalidKeyErr?.status, 401)
  t.is(invalidKeyErr?.response.error.type, "unauthorized")

  // Test using client session token instead of API key,
  // which defers to the client session auth method
  const clientSessionErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/list", {
      headers: {
        Authorization: `Bearer seam_cst1_123`,
      },
    }),
  )
  t.is(clientSessionErr?.status, 401)
  t.is(clientSessionErr?.response.error.type, "client_session_not_found")

  // Test using access token instead of API key,
  // which /devices/list does not accept
  const accessTokenErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/list", {
      headers: {
        Authorization: `Bearer seam_at_123`,
      },
    }),
  )
  t.is(accessTokenErr?.status, 401)
  t.is(accessTokenErr?.response.error.type, "unauthorized")

  // Test using JWT instead of API key,
  // which defers to the console session auth method
  const token = jwt.sign({ some: "payload" }, "secret")
  const jwtErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/list", {
      headers: {
        Authorization: `Bearer ${token}`,
        "seam-workspace": seed_result.seed_workspace_1,
      },
    }),
  )
  t.is(jwtErr?.status, 401)
  t.is(jwtErr?.response.error.type, "unauthorized")
})
