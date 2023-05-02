import { z } from 'zod'

import { withRouteSpec } from 'lib/middleware/index.ts'
import { BadRequestException } from 'nextlove'

export default withRouteSpec({
  auth: 'cst_ak_pk',
  methods: ['POST', 'PUT'],
  middlewares: [],
  jsonBody: z.object({
    connected_account_ids: z.array(z.string()).optional(),
    connect_webview_ids: z.array(z.string()).optional(),
    user_identifier_key: z.string().optional(),
  }),
  jsonResponse: z.object({
    ok: z.literal(true),
  }),
} as const)(async (req, res) => {
  // TODO if pubkey, cannot accept uuids for ownership

  if (
    req.auth.auth_mode === 'publishable_key' &&
    !req.body.user_identifier_key
  ) {
    throw new BadRequestException({
      type: 'missing_user_identifier_key',
      message:
        'You must provide a user_identifier_key when using a publishable key',
    })
  }

  if (req.body.user_identifier_key) {
    const existing_cst = req.db.client_session_tokens.find(
      (cst) => cst.user_identifier_key === req.body.user_identifier_key
    )
    if (existing_cst && req.method !== 'PUT') {
      throw new BadRequestException({
        type: 'client_session_token_already_exists',
        message:
          'A client session token already exists for this user, try using /client_session_tokens/get_or_create',
      })
    }
    res.json({
      client_session_token: existing_cst,
      ok: true,
    })
    return
  }

  const { workspace_id } = req.auth
  const client_session_token = req.db.addClientSessionToken({
    workspace_id,
    connect_webview_ids: req.body.connect_webview_ids,
    connected_account_ids: req.body.connected_account_ids,
    user_identifier_key: req.body.user_identifier_key,
  })
  // req.db.

  res.json({
    client_session_token,
    ok: true,
  })
})
