import { createWithRouteSpec } from "nextlove"

import withApiKey from "./with-api-key.ts"
import withCors from "./with-cors.ts"
import { withCSTOrApiKeyOrPublishableKey } from "./with-cst-or-api-key-or-publishable-key.ts"
import withDb from "./with-db.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "Fake Seam Connect",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withCors, withDb],
  authMiddlewareMap: {
    api_key: withApiKey,
    cst_ak_pk: withCSTOrApiKeyOrPublishableKey,
  },
} as const)

export default withRouteSpec
