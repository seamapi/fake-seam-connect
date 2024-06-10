import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seedDatabase } from "lib/database/seed.ts"

test("GET /internal/phone/user_identities/create_invitations", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seedDatabase(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const ext_sdk_installation_id = "ext_sdk_installation_id"

  const { data, status } = await axios.post(
    "/internal/phone/user_identities/create_invitations",
    {
      custom_sdk_installation_id: ext_sdk_installation_id,
      phone_os: "android",
    },
  )

  t.is(status, 200)

  // Invitation code gets set from acs sync job and can be fetched from `/internal/phone/user_identities/get_invitations`
  t.true(data.invitations.length > 0)
  t.truthy(data.invitations[0]?.invitation_id)
  t.is(data.invitations[0]?.invitation_type, "assa_abloy_credential_service")

  const { data: updated_data } = await axios.post(
    "/internal/phone/user_identities/create_invitations",
    {
      custom_sdk_installation_id: ext_sdk_installation_id,
      phone_os: "android",
    },
  )

  // On second pass invitation code is still null
  t.true(updated_data.invitations.length > 0)
  t.truthy(updated_data.invitations[0]?.invitation_id)
  t.is(
    updated_data.invitations[0]?.invitation_type,
    "assa_abloy_credential_service",
  )
})
