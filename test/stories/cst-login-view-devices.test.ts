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
})
