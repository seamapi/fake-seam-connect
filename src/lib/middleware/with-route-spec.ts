import { createWithRouteSpec } from "nextlove"

import { withAccessToken } from "./with-access-token.ts"
import { withAdminAuth } from "./with-admin-auth.ts"
import { withApiKey } from "./with-api-key.ts"
import { withBaseUrl } from "./with-base-url.ts"
import { withCors } from "./with-cors.ts"
import { withCst } from "./with-cst.ts"
import { withCSTOrApiKeyOrPublishableKey } from "./with-cst-or-api-key-or-publishable-key.ts"
import { withDb } from "./with-db.ts"
import { withRequestId } from "./with-request-id.ts"

export const withRouteSpec = createWithRouteSpec({
  apiName: "Fake Seam Connect",
  productionServerUrl: "https://example.com",
  shouldValidateGetRequestBody: false,
  globalMiddlewares: [withCors, withDb, withBaseUrl, withRequestId],
  addOkStatus: true,
  securitySchemas: {
    client_session: {
      type: "apiKey",
      in: "header",
      name: "client-session-token",
    },
    pat_with_workspace: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "API Token",
    },
    pat_without_workspace: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "API Token",
    },
    console_session: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "Console Session Token",
    },
    api_key: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "API Key",
    },
  },

  authMiddlewareMap: {
    admin: withAdminAuth,
    access_token: withAccessToken({ require_workspace_id: true }),
    pat_with_workspace: withAccessToken({ require_workspace_id: true }),
    pat_without_workspace: withAccessToken({ require_workspace_id: false }),
    session_or_access_token_optional_workspace_id: withAccessToken({
      require_workspace_id: false,
    }),
    api_key: withApiKey,
    client_session: withCst,
    cst_ak_pk: withCSTOrApiKeyOrPublishableKey,
  },
} as const)
