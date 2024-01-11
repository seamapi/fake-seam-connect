import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("GET /internal/phone/user_identities/get_invitation", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seed(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const ext_sdk_installation_id = "ext_sdk_installation_id"

  await axios.post("/internal/phone/user_identities/load_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  const {
    data: { invitations },
  } = await axios.post("/internal/phone/user_identities/load_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  if (invitations[0] === undefined) {
    t.fail("Didn't get invitations")
    return
  }

  const { data, status } = await axios.post(
    "/internal/phone/user_identities/get_invitation",
    {
      custom_sdk_installation_id: ext_sdk_installation_id,
      invitation_id: invitations[0].invitation_id,
      invitation_type: invitations[0].invitation_type,
    },
  )

  t.is(status, 200)
  t.like(data, {
    invitation: {
      invitation_id: invitations[0].invitation_id,
      invitation_type: invitations[0].invitation_type,
    },
  })
})
