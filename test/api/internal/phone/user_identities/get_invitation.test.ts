import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test.skip("GET /internal/phone/user_identities/get_invitation", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token, seed_workspace_1, schlage_device_1 } = seed(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const ext_sdk_installation_id = "ext_sdk_installation_id"

  // todo: use endpoints rather than direct db access
  // create a phone sdk installation
  // const phone_sdk_installation = db.addPhoneSdkInstallation({
  //   device_id: schlage_device_1,
  //   workspace_id: seed_workspace_1,
  //   client_session_id: client_session.client_session_id,
  //   ext_sdk_installation_id,
  // })

  // const invitation = db.addInvitation({
  //   invitation_type: "hid_credential_manager",
  //   phone_sdk_installation_id: phone_sdk_installation.phone_sdk_installation_id,
  //   workspace_id: seed_workspace_1,
  // })

  // const { data, status } = await axios.post(
  //   "/internal/phone/user_identities/get_invitation",
  //   {
  //     custom_sdk_installation_id: ext_sdk_installation_id,
  //     invitation_id: invitation.invitation_id,
  //     invitation_type: invitation.invitation_type,
  //   },
  // )

  // t.is(status, 200)
  // t.like(data, {
  //   invitation: {
  //     invitation_id: invitation.invitation_id,
  //     invitation_type: invitation.invitation_type,
  //   },
  // })
})
