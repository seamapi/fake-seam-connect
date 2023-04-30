import { type Middleware } from 'nextlove'

import { type Database } from 'lib/database/index.ts'

export const withCSTOrApiKeyOrPublishableKey: Middleware<
  {
    auth:
      | { auth_mode: 'api_key'; workspace_id: string }
      | { auth_mode: 'client_session_token'; workspace_id: string }
      | { auth_mode: 'publishable_key'; workspace_id: string }
  },
  {
    db: Database
  }
> = (next) => async (req, res) => {
  const token =
    req.headers.authorization?.split('Bearer ')?.[1] ??
    req.headers['client-session-token']
  if (token == null) return res.status(401).end('Unauthorized')

  const is_cst = token.includes('seam_cst')
  const is_api_key = !is_cst

  // TODO: Validate authorization.
  // If relevant, add the user or the decoded JWT to the request on req.auth.
  req.auth = { auth_mode: 'api_key' }

  return next(req, res)
}

withCSTOrApiKeyOrPublishableKey.securitySchema = {
  type: 'apiKey',
}

export default withCSTOrApiKeyOrPublishableKey
