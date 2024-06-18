import test, { type ExecutionContext } from "ava"
import jwt from "jsonwebtoken"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /workspaces/reset_sandbox", async (t: ExecutionContext) => {
  const {
    axios,
    seed: { ws2 },
    db,
  } = await getTestServer(t)

  const cs = db.client_sessions.find((cs) => cs.token === ws2.cst)

  const token = jwt.sign(
    { user_identity_id: cs?.user_identity_ids[0] },
    "secret",
  )

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
      Authorization: `Bearer ${token}`,
      "seam-workspace": ws2.workspace_id,
    },
  })

  t.is(devices.length, 3)

  await axios.post(
    "/workspaces/reset_sandbox",
    {},
    {
      headers: {
        "seam-workspace": ws2.workspace_id,
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const devices_res = await axios.get("/devices/list", {
    headers: {
      Authorization: `Bearer ${token}`,
      "seam-workspace": ws2.workspace_id,
    },
    validateStatus: () => true,
  })

  t.is(devices_res.status, 401)
  t.is((devices_res.data as any).error.type, "unauthorized")

  t.is(db.devices.filter((d) => d.workspace_id === ws2.workspace_id).length, 0)
  t.is(
    db.client_sessions.filter((cs) => cs.workspace_id === ws2.workspace_id)
      .length,
    0,
  )
})
