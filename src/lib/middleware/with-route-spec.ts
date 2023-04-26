import { createWithRouteSpec } from 'nextlove'

import withApiKey from './with-api-key.ts'
import withDb from './with-db.ts'

export const withRouteSpec = createWithRouteSpec({
  apiName: 'Fake Template',
  productionServerUrl: 'https://example.com',
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withDb],
  authMiddlewareMap: {
    api_key: withApiKey,
  },
} as const)

export default withRouteSpec
