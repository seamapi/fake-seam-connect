import { createWithRouteSpec } from "nextlove"
import { z } from "zod"

import { withAccessToken } from "./with-access-token.ts"
import { withAdminAuth } from "./with-admin-auth.ts"
import { withApiKey } from "./with-api-key.ts"
import { withBaseUrl } from "./with-base-url.ts"
import { withClientSession } from "./with-client-session.ts"
import { withCors } from "./with-cors.ts"
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
    console_session_with_workspace: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "Console Session Token",
    },
    console_session_without_workspace: {
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
    console_session_with_workspace: withSessionAuth({
      is_workspace_id_required: true,
    }),
    console_session_without_workspace: withSessionAuth({
      is_workspace_id_required: false,
    }),
    api_key: withApiKey,
    client_session: withClientSession,
  },
} as const)

/**
 * only used for typing has no purpose
 */
const disposableRouteSpec = withRouteSpec({
  auth: ["pat_with_workspace", "console_session_with_workspace", "api_key"],
  methods: ["POST", "GET", "PATCH", "DELETE"],
  jsonBody: z.object({}),
  jsonResponse: z.object({}),
} as const);

export type RouteSpecRequest = Parameters<Parameters<typeof disposableRouteSpec>[0]>[0]
export type RouteSpecResponse = Parameters<Parameters<typeof disposableRouteSpec>[0]>[1]
