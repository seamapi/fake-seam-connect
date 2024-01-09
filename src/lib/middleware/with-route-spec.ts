import { createWithRouteSpec } from "nextlove"

import { withApiKey } from "./with-api-key.ts"
import { withBaseUrl } from "./with-base-url.ts"
import { withCors } from "./with-cors.ts"
import { withCSTOrApiKeyOrPublishableKey } from "./with-cst-or-api-key-or-publishable-key.ts"
import { withDb } from "./with-db.ts"
import { withRequestId } from "./with-request-id.ts"
import { withAdminAuth } from "./with-admin-auth.ts"
import { withCst } from "./with-cst.ts"
import { withAccessToken } from "./with-access-token.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "Fake Seam Connect",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withCors, withDb, withBaseUrl, withRequestId],
  addOkStatus: true,
  authMiddlewareMap: {
    admin: withAdminAuth,
    access_token: withAccessToken,
    api_key: withApiKey,
    client_session: withCst,
    cst_ak_pk: withCSTOrApiKeyOrPublishableKey,
  },
} as const)
