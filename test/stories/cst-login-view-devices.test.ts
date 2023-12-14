import test from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("Login via a CST and view devices", async (t) => {
  const { axios, seed } = await getTestServer(t)

  const pk_headers = {
    "Seam-Publishable-Key": seed.ws1.publishable_key,
  }

  const {
    data: { client_session },
  } = await axios.post(
    "/client_sessions/create",
    {
      user_identifier_key: "my_test_user",
    },
    { headers: pk_headers }
  )

  const cst_headers = {
    Authorization: `Bearer ${client_session.token}`,
  }

  t.is(client_session.user_identifier_key, "my_test_user")
  t.truthy(client_session.token)

  const {
    data: { connect_webview: pending_connect_webview },
  } = await axios.post(
    "/connect_webviews/create",
    {
      accepted_providers: ["august"],
    },
    { headers: cst_headers }
  )

  t.is(pending_connect_webview.status, "pending")

  await axios.post("/_fake/complete_connect_webview", {
    connect_webview_id: pending_connect_webview.connect_webview_id,
  })

  const {
    data: { connect_webview: authorized_connect_webview },
  } = await axios.get("/connect_webviews/get", {
    params: {
      connect_webview_id: pending_connect_webview.connect_webview_id,
    },
    headers: cst_headers,
  })

  t.is(authorized_connect_webview.status, "authorized")

  const {
    data: { connected_account },
  } = await axios.get("/connected_accounts/get", {
    params: {
      connected_account_id:
        authorized_connect_webview.connected_account_id!,
    },
    headers: cst_headers,
  })

  t.is(connected_account.provider, "august")

  const {
    data: { connected_accounts },
  } = await axios.get("/connected_accounts/list", {
    params: {
      connected_account_id: connected_account.connected_account_id,
    },
    headers: cst_headers,
  })

  t.is(connected_accounts.length, 1)

  const {
    data: { devices },
  } = await axios.get("/devices/list", {
    headers: cst_headers,
  })

  t.is(devices.length, 1)

  const {
    data: { device },
  } = await axios.get("/devices/get", {
    params: {
      device_id: devices?.[0]?.device_id!,
    },
    headers: cst_headers,
  })

  t.is(device.device_type, "august_lock")

  const {
    data: { access_code },
  } = await axios.post(
    "/access_codes/create",
    {
      device_id: device.device_id,
      code: "1234",
      name: "My Test Code",
    },
    {
      headers: cst_headers,
    }
  )

  t.is(access_code.code, "1234")

  const {
    data: { access_codes },
  } = await axios.get("/access_codes/list", {
    params: {
      device_id: device.device_id,
    },
    headers: cst_headers,
  })

  t.is(access_codes.length, 1)
})
