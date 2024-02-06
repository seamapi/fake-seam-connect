import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /api/internal/sandbox/:workspace_id/visionline/_fake/load_credentials", async (t) => {
  const { axios, db } = await getTestServer(t, { seed: false })
  const { seam_cst1_token } = seed(db)

  const client_session = db.getClientSession(seam_cst1_token)

  if (client_session === undefined) {
    t.fail("Client session not found")
    return
  }

  axios.defaults.headers.common.Authorization = `Bearer ${seam_cst1_token}`

  const ext_sdk_installation_id = "ext_sdk_installation_id"

  const {
    data: { invitations },
  } = await axios.post("/internal/phone/user_identities/create_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  const {
    data: { invitation },
  } = await axios.post("/internal/phone/user_identities/get_invitation", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    invitation_id: invitations[0]?.invitation_id ?? "",
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/no-non-null-assertion
    invitation_type: invitations[0]?.invitation_type!,
  })

  const invitation_code = invitation.invitation_code ?? ""
  if (invitation_code === "") {
    t.fail("Failed to create invite")
  }

  const {
    data: { endpoint },
  } = await axios.post(
    `/internal/sandbox/test/visionline/_fake/redeem_invite_code`,
    {
      invite_code: invitation_code,
      endpoint_details: {
        application_version: "",
        ble_capability: true,
        device_manufacturer: "",
        device_model: "",
        hce_capability: true,
        nfc_capability: true,
        os_version: "",
        seos_applet_version: "",
      },
    },
  )

  t.truthy(endpoint.endpoint_id)
  t.truthy(endpoint.invite_code)

  const {
    data: { cards },
  } = await axios.post(
    "/internal/sandbox/test/visionline/_fake/load_credentials",
    {
      endpoint_id: endpoint.endpoint_id,
    },
  )

  t.is(cards.length, 1)
  t.false(cards[0]?.notIssued)
  t.false(cards[0]?.expired)
})
