import { BadRequestException, HttpException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

import { client_session } from "lib/zod/client_session.ts"

export default withRouteSpec({
  auth: [
    "api_key",
    "pat_with_workspace",
    "console_session_with_workspace",
    "publishable_key",
  ],
  methods: ["POST", "PUT"],
  middlewares: [],
  jsonBody: z.object({
    connected_account_ids: z.array(z.string()).optional(),
    connect_webview_ids: z.array(z.string()).optional(),
    user_identifier_key: z.string().optional(),
  }),
  jsonResponse: z.object({
    client_session,
    ok: z.literal(true),
  }),
} as const)(async (req, res) => {
  const { connect_webview_ids, connected_account_ids, user_identifier_key } =
    req.body

  if (
    req.auth.type === "publishable_key" &&
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (connect_webview_ids != null || connected_account_ids != null)
  ) {
    throw new HttpException(403, {
      type: "publishable_keys_must_create_empty_client_sessions",
      message:
        "You cannot specify connect_webview_ids or connected_account_ids when using a publishable key",
    })
  }

  if (user_identifier_key != null) {
    const existing_cs = req.db.client_sessions.find(
      (cst) =>
        cst.user_identifier_key === user_identifier_key &&
        cst.workspace_id === req.auth.workspace_id,
    )

    if (existing_cs != null) {
      if (req.method !== "PUT") {
        throw new BadRequestException({
          type: "client_session_token_already_exists",
          message:
            "A client session token already exists for this user, try using /client_session_tokens/get_or_create",
        })
      }
      res.json({
        client_session: existing_cs,
        ok: true,
      })
      return
    }
  }

  const client_session = req.db.addClientSession({
    workspace_id: req.auth.workspace_id,
    connect_webview_ids,
    connected_account_ids,
    user_identifier_key,
    publishable_key:
      req.auth.type === "publishable_key"
        ? req.auth.publishable_key
        : undefined,
    api_key_id: req.auth.type === "api_key" ? req.auth.api_key_id : undefined,
  })
  const device_count = req.db.devices.filter(
    (d) =>
      d?.connected_account_id !== undefined &&
      client_session.connected_account_ids.includes(d.connected_account_id),
  ).length

  res.json({
    client_session: {
      ...client_session,
      device_count,
    },
    ok: true,
  })
})
