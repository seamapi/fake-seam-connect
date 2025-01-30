import test from "ava"
import ms from "ms"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("withClientSession middleware - successful auth", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const seed_result = seedDatabase(db)

  // Test successful auth with client session token
  const { status } = await axios.get("/connected_accounts/get", {
    params: {
      connected_account_id: seed_result.john_connected_account_id,
    },
    headers: {
      Authorization: `Bearer ${seed_result.seam_cst1_token}`,
    },
  })
  t.is(status, 200)

  // Test missing Authorization header
  const missingAuthErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/connected_accounts/get", {
      params: {
        connected_account_id: seed_result.john_connected_account_id,
      },
    }),
  )

  t.is(missingAuthErr?.status, 401)
  t.is(missingAuthErr?.response.error.type, "unauthorized")

  // Test invalid client session token format
  const invalidTokenErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/connected_accounts/get", {
      params: {
        connected_account_id: seed_result.john_connected_account_id,
      },
      headers: {
        Authorization: "Bearer invalid_token",
      },
    }),
  )
  t.is(invalidTokenErr?.status, 400)
  t.is(invalidTokenErr?.response.error.type, "invalid_client_session_token")

  // Test expired client session
  const expired_session = db.addClientSession({
    workspace_id: seed_result.seed_workspace_1,
    expires_at: new Date(Date.now() - ms("1 day")).toISOString(),
  })

  const expiredErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/connected_accounts/get", {
      params: {
        connected_account_id: seed_result.john_connected_account_id,
      },
      headers: {
        Authorization: `Bearer ${expired_session.token}`,
      },
    }),
  )
  t.is(expiredErr?.response.error.type, "client_session_expired")
  t.is(expiredErr?.status, 401)

  // Test revoked client session
  const revoked_session = db.addClientSession({
    workspace_id: seed_result.seed_workspace_1,
    revoked_at: new Date(Date.now() - ms("1 hour")).toISOString(),
  })

  const revokedErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/connected_accounts/get", {
      params: {
        connected_account_id: seed_result.john_connected_account_id,
      },
      headers: {
        Authorization: `Bearer ${revoked_session.token}`,
      },
    }),
  )
  t.is(revokedErr?.status, 401)
  t.is(revokedErr?.response.error.type, "client_session_revoked")
})
