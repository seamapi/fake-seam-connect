import test from "ava"
import jwt from "jsonwebtoken"

import { getTestServer, type SimpleAxiosError } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("withSessionAuth middleware - successful auth", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  const token = jwt.sign(
    {
      user_id: seed_result.john_user_id,
      key: seed_result.john_user_key,
    },
    "secret",
  )

  // Test successful auth with workspace
  const { status } = await axios.get("/workspaces/get", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Seam-Workspace": seed_result.seed_workspace_1,
    },
  })
  t.is(status, 200)

  // Test missing workspace header
  const missingWorkspaceErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/workspaces/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  )

  t.is(missingWorkspaceErr?.status, 400)
  t.is(missingWorkspaceErr?.response.error.type, "missing_workspace_id")

  // Test invalid token
  const invalidTokenErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/workspaces/get", {
      headers: {
        Authorization: "Bearer invalid_token",
        "Seam-Workspace": seed_result.seed_workspace_1,
      },
    }),
  )

  t.is(invalidTokenErr?.status, 500)

  // Test unauthorized workspace access
  const unauthorizedErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/workspaces/get", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Seam-Workspace": "invalid_workspace_id",
      },
    }),
  )

  t.is(unauthorizedErr?.status, 401)
  t.is(unauthorizedErr?.response.error.type, "unauthorized")
})
