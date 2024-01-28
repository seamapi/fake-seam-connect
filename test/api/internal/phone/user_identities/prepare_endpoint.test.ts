import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /internal/phone/user_identities/prepare_endpoint", async (t) => {
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

  // On second pass invitation code is set and endpoint created
  const {
    data: { invitation },
  } = await axios.post("/internal/phone/user_identities/get_invitation", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    invitation_id: invitations[0]?.invitation_id ?? "",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    invitation_type: invitations[0]?.invitation_type!,
  })

  const invitation_code = invitation?.invitation_code ?? ""
  if (invitation_code === "") {
    t.fail("Failed to create invite")
  }

  await axios.post(
    `/internal/sandbox/${client_session.workspace_id}/assa_abloy/_fake/redeem_invite_code`,
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

  if (invitation.invitation_type !== "assa_abloy_credential_service") {
    t.fail(
      "Expected to get assa_abloy_credential_service invitation. Got " +
        invitation.invitation_type +
        " instead",
    )
    return
  }

  if (invitation.ext_assa_abloy_cs_endpoint_id == null)
    throw new Error("Expected ext_assa_abloy_cs_endpoint_id to be set")

  const {
    data: { endpoint: prepared_endpoint },
  } = await axios.post("/internal/phone/user_identities/prepare_endpoint", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    endpoint_id: invitation.ext_assa_abloy_cs_endpoint_id,
  })

  t.like(prepared_endpoint, {
    endpoint_id: invitation.ext_assa_abloy_cs_endpoint_id,
    is_active: true,
  })
})
