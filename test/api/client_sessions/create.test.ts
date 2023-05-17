import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

// This is how the @seamapi client currently sends it's data- it's wrong but
// we can be generous
test("POST /client_sessions/create (without body, malformed content-type)", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const {
    data: { client_session },
  } = await axios.request({
    url: "/client_sessions/create",
    method: "POST",
    headers: {
      "Seam-Publishable-Key": seed.ws2.publishable_key,
      "Seam-User-Identifier-Key": "hello_world",
      "Content-Type": "",
    },
    data: "",
  } as any)

  t.truthy(client_session)
})
