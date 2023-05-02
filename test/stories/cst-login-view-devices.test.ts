import test from "ava"
import { getTestServer } from "fixtures/get-test-server.ts"

test("Login via a CST and view devices", async (t) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.post(
    "/internal/client_sessions/create",
    {
      user_identifier_key: "my_test_user",
    },
    {
      headers: {
        "Seam-Publishable-Key": seed.ws1.publishable_key,
      },
    }
  )

  t.is(client_session.user_identifier_key, "my_test_user")
  t.truthy(client_session.token)

  const {
    data: { connect_webview: pending_connect_webview },
  } = await axios.post(
    "/connect_webviews/create",
    {
      accepted_providers: ["august"],
    },
    {
      headers: {
        Authorization: `Bearer ${client_session.token}`,
      },
    }
  )

  t.is(pending_connect_webview.status, "pending")

  await axios.post("/fake_only/complete_connect_webview", {
    connect_webview_id: pending_connect_webview.connect_webview_id,
  })

  const {
    data: { connect_webview: authorized_connect_webview },
  } = await axios.post(
    "/connect_webviews/get",
    {
      accepted_providers: ["august"],
    },
    {
      headers: {
        Authorization: `Bearer ${client_session.token}`,
      },
    }
  )
})
