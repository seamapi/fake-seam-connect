import test from "ava"

import {
  getTestServer,
  type SimpleAxiosError,
} from "fixtures/get-test-server.ts"

test("withAccessToken middleware - pat_with_workspace auth", async (t) => {
  const { axios, seed } = await getTestServer(t)

  // Test successful auth with workspace
  const { status } = await axios.get("/devices/get", {
    params: {
      device_id: seed.ws2.device1_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
      "seam-workspace": seed.ws2.workspace_id,
    },
  })
  t.is(status, 200)

  // Test missing workspace header
  const missingWorkspaceErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/get", {
      params: {
        device_id: seed.ws2.device1_id,
      },
      headers: {
        Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
      },
    }),
  )
  t.is(missingWorkspaceErr?.status, 400)
  t.is(missingWorkspaceErr?.response.error.type, "missing_workspace_id")

  // Test invalid workspace
  const invalidWorkspaceErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/get", {
      params: {
        device_id: seed.ws2.device1_id,
      },
      headers: {
        Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
        "seam-workspace": "invalid_workspace",
      },
    }),
  )
  t.is(invalidWorkspaceErr?.status, 401)
  t.is(invalidWorkspaceErr?.response.error.type, "unauthorized")

  // Test missing Authorization header
  const missingAuthErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/get", {
      params: {
        device_id: seed.ws2.device1_id,
      },
      headers: {
        "seam-workspace": seed.ws2.workspace_id,
      },
    }),
  )
  t.is(missingAuthErr?.status, 401)
  t.is(missingAuthErr?.response.error.type, "unauthorized")

  // Test using client session token instead of access token
  const clientSessionErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/devices/get", {
      params: {
        device_id: seed.ws2.device1_id,
      },
      headers: {
        Authorization: `Bearer seam_cst1_123`,
        "seam-workspace": seed.ws2.workspace_id,
      },
    }),
  )
  t.is(clientSessionErr?.status, 401)
  t.is(clientSessionErr?.response.error.type, "unauthorized")
})

test("withAccessToken middleware - pat_without_workspace auth", async (t) => {
  const { axios, seed } = await getTestServer(t)

  // Test successful auth without workspace
  const { status } = await axios.get("/workspaces/list", {
    headers: {
      Authorization: `Bearer ${seed.ws2.seam_at1_token}`,
    },
  })
  t.is(status, 200)

  // Test missing Authorization header
  const missingAuthErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/workspaces/list"),
  )
  t.is(missingAuthErr?.status, 401)
  t.is(missingAuthErr?.response.error.type, "unauthorized")

  // Test invalid access token
  const invalidTokenErr = await t.throwsAsync<SimpleAxiosError>(
    axios.get("/workspaces/list", {
      headers: {
        Authorization: "Bearer seam_at_invalid",
      },
    }),
  )
  t.is(invalidTokenErr?.status, 401)
  t.is(invalidTokenErr?.response.error.type, "unauthorized")
})
