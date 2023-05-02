import { createWithRouteSpec } from "nextlove"

import withApiKey from "./with-api-key.ts"
import withDb from "./with-db.ts"
import { withCSTOrApiKeyOrPublishableKey } from "./with-cst-or-api-key-or-publishable-key.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "Fake Seam Connect",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withDb],
  authMiddlewareMap: {
    api_key: withApiKey,
    cst_ak_pk: withCSTOrApiKeyOrPublishableKey,
  },
} as const)

export default withRouteSpec
