import test from 'ava'
import { getTestServer } from 'fixtures/get-test-server.ts'

test('Login via a CST and view devices', async (t) => {
  const { axios, seed } = await getTestServer(t)
  const { data } = await axios.post('/internal/client_session_tokens/create', {
    headers: {
      Authorization: 'Bearer ' + seed.ws1.publishable_key,
    },
  })
  // t.is(data.length, 2)
})
