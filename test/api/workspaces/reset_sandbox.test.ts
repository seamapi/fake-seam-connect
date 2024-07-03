import test, { type ExecutionContext } from "ava"
import jwt from "jsonwebtoken"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /workspaces/reset_sandbox", async (t: ExecutionContext) => {
  const {
    axios,
    seed: { ws2 },
    db,
  } = await getTestServer(t)

  const userWorkspace = db.user_workspaces.find(
    (uw) => uw.workspace_id === ws2.workspace_id,
  )

  if (userWorkspace == null) {
    throw new Error("User workspace not found")
  }

  const user_session = db.user_sessions.find(
    (us) => us.user_id === userWorkspace.user_id,
  )

  const token = jwt.sign(
    { user_id: user_session?.user_id, key: user_session?.key },
    "secret",
  )

  t.is(db.devices.filter((d) => d.workspace_id === ws2.workspace_id).length, 3)
  t.is(
    db.user_workspaces.filter((uw) => uw.workspace_id === ws2.workspace_id)
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

  t.is(devices_res.status, 200)

  t.is(db.devices.filter((d) => d.workspace_id === ws2.workspace_id).length, 0)
})
