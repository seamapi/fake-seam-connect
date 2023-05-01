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
    (req.headers['client-session-token'] as string | null)
  if (!token) return res.status(401).end('Unauthorized')

  const is_cst = token.includes('seam_cst')
  const is_pub_key = token.includes('seam_pk')
  const is_api_key = !is_cst && !is_pub_key
  const long_token = token.split('_')?.[2]
  const short_token = token.split('_')?.[1]

  if (!short_token || !long_token) return res.status(400).end('malformed token')

  if (is_pub_key) {
    req.db.client_session_tokens
    const workspace = req.db.workspaces.find(
      (ws) => ws.publishable_key === token
    )
    if (!workspace)
      return res.status(401).end('Unauthorized (workspace not found)')

    req.auth = {
      auth_mode: 'publishable_key',
      workspace_id: workspace.workspace_id,
    }
    return next(req, res)
  }

  if (is_cst) {
    throw new Error('Not Implemented')
  }

  if (is_cst) {
    throw new Error('Not Implemented')
  }

  return next(req, res)
}

withCSTOrApiKeyOrPublishableKey.securitySchema = {
  type: 'apiKey',
}

export default withCSTOrApiKeyOrPublishableKey
