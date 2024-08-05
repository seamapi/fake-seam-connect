import { createWithRouteSpec } from "nextlove"

import { withAccessToken } from "./with-access-token.ts"
import { withAdminAuth } from "./with-admin-auth.ts"
import { withApiKey } from "./with-api-key.ts"
import { withBaseUrl } from "./with-base-url.ts"
import { withClientSession } from "./with-client-session.ts"
import { withCors } from "./with-cors.ts"
import { withClientSessionOrApiKeyOrPublishableKey } from "./with-cst-or-api-key-or-publishable-key.ts"
import { withDb } from "./with-db.ts"
import { withRequestId } from "./with-request-id.ts"
import { withSessionAuth } from "./with-session-auth.ts"

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
      name: "Client Session Token",
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
    access_token: withAccessToken({ is_workspace_id_required: true }),
    pat_with_workspace: withAccessToken({ is_workspace_id_required: true }),
    pat_without_workspace: withAccessToken({ is_workspace_id_required: false }),
    console_session: withSessionAuth({ is_workspace_id_required: true }),
    api_key: withApiKey,
    client_session: withClientSession,
    cst_ak_pk: withClientSessionOrApiKeyOrPublishableKey,
    // only for get_or_create and create client session token
  },
} as const)
