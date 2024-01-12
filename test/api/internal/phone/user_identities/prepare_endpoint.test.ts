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

  // On first pass invitation code isn't set but we get back an invitation
  await axios.post("/internal/phone/user_identities/load_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  // On second pass invitation code is set and endpoint created
  const {
    data: { invitations },
  } = await axios.post("/internal/phone/user_identities/load_invitations", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    phone_os: "android",
  })

  const invitation_code = invitations[0]?.invitation_code ?? ""
  if (invitation_code === "") {
    t.fail("Failed to create invite")
  }

  const {
    data: { endpoint },
  } = await axios.post(
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

  const {
    data: { endpoint: prepared_endpoint },
  } = await axios.post("/internal/phone/user_identities/prepare_endpoint", {
    custom_sdk_installation_id: ext_sdk_installation_id,
    endpoint_id: endpoint.endpoint_id,
  })

  t.like(prepared_endpoint, {
    endpoint_id: endpoint.endpoint_id,
    is_active: endpoint.status === "ACTIVE",
  })
})
