import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"
import { seed } from "lib/database/seed.ts"

test("POST /internal/phone/user_identities/list_endpoints", async (t) => {
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

  const {
    data: { invitations },
  } = await axios.post("/internal/phone/user_identities/create_invitations", {
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
    data: { endpoints },
    status,
  } = await axios.post("/internal/phone/user_identities/list_endpoints", {
    custom_sdk_installation_id: ext_sdk_installation_id,
  })

  t.is(status, 200)
  t.like(endpoints[0], {
    endpoint_id: endpoint.endpoint_id,
    is_active: endpoint.status === "ACTIVE",
  })
})