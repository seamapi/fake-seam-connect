import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("DELETE /internal/phone/deactivate", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seed(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const ext_sdk_installation_id = "ext_sdk_installation_id"

  await axios.post("/internal/phone/user_identities/create_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  const { status } = await axios.post("/internal/phone/deactivate", {
    custom_sdk_installation_id: ext_sdk_installation_id,
  })

  t.is(status, 200)

  const endpoints = db.getEndpoints({
    client_session_id: client_session.client_session_id,
    phone_sdk_installation_id: ext_sdk_installation_id,
  })

  t.is(endpoints.length, 0)

  const invitations = db.getInvitations({
    client_session_id: client_session.client_session_id,
    phone_sdk_installation_id: ext_sdk_installation_id,
  })

  t.is(invitations.length, 0)

  const phone_sdk_installation = db.getPhoneSdkInstallation({
    client_session_id: client_session.client_session_id,
    ext_sdk_installation_id,
    workspace_id: client_session.workspace_id,
  })

  t.is(phone_sdk_installation, undefined)
})
