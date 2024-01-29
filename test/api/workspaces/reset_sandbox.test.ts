import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /workspaces/reset_sandbox", async (t: ExecutionContext) => {
  const {
    axios,
    seed: { ws2 },
    db,
  } = await getTestServer(t)

  t.is(db.devices.filter((d) => d.workspace_id === ws2.workspace_id).length, 3)
  t.is(
    db.client_sessions.filter((cs) => cs.workspace_id === ws2.workspace_id)
      .length,
    1,
  )

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    headers: {
      Authorization: `Bearer ${ws2.cst}`,
    },
  })

  t.is(devices.length, 3)

  await axios.post(
    "/workspaces/reset_sandbox",
    {},
    {
      headers: {
        Authorization: `Bearer ${ws2.cst}`,
      },
    },
  )

  const devices_res = await axios.get("/devices/list", {
    headers: {
      Authorization: `Bearer ${ws2.cst}`,
    },
    validateStatus: () => true,
  })

  t.is(devices_res.status, 404)
  t.is((devices_res.data as any).error.type, "client_session_token_not_found")

  t.is(db.devices.filter((d) => d.workspace_id === ws2.workspace_id).length, 0)
  t.is(
    db.client_sessions.filter((cs) => cs.workspace_id === ws2.workspace_id)
      .length,
    0,
  )
})
