import { BadRequestException, UnauthorizedException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

import { client_session } from "lib/zod/client_session.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST", "PUT"],
  middlewares: [],
  jsonBody: z.union([
    z.any(),
    z
      .object({
        connected_account_ids: z.array(z.string()).optional(),
        connect_webview_ids: z.array(z.string()).optional(),
        user_identifier_key: z.string().optional(),
      })
      .optional(),
  ]),
  jsonResponse: z.object({
    client_session,
    ok: z.literal(true),
  }),
} as const)(async (req, res) => {
  // TODO if pubkey, fail if connect_webview_ids or connected_account_ids are provided

  const user_identifier_key =
    req.body?.user_identifier_key ??
    (req.headers["user-identifier-key"] as string | undefined) ??
    (req.headers["seam-user-identifier-key"] as string | undefined)

  const publishable_key = req.headers["seam-publishable-key"] as
    | string
    | undefined

  const token =
    req.headers["seam-api-key"] ??
    req.headers.authorization?.split("Bearer ")?.[1]

  if (publishable_key == null && token == null) {
    throw new BadRequestException({
      type: "seam_api_or_publishable_key_header_required",
      message: "Seam-Api-Key or Seam-Publishable-Key header required",
    })
  }

  if (publishable_key != null && user_identifier_key == null) {
    throw new UnauthorizedException({
      type: "missing_user_identifier_key",
      message:
        "You must provide a user_identifier_key when using a publishable key",
    })
  }

  if (token == null && user_identifier_key == null) {
    throw new UnauthorizedException({
      type: "missing_user_identifier_key",
      message: "You must provide a user_identifier_key when using an api key",
    })
  }

  let workspace_id: string | null = null
  if (token != null && publishable_key == null) {
    const api_key = req.db.api_keys.find((a) => a.token === token)

    if (api_key == null) {
      throw new BadRequestException({
        type: "invalid_api_key",
        message: "Invalid api key",
      })
    }
    workspace_id = api_key.workspace_id
  }

  if (publishable_key != null && token == null) {
    const workspace = req.db.workspaces.find(
      (w) => w.publishable_key === publishable_key,
    )

    if (workspace == null) {
      throw new BadRequestException({
        type: "Workspace not found",
        message: "Workspace not found",
      })
    }
    workspace_id = workspace.workspace_id
  }

  if (user_identifier_key != null) {
    const existing_cs = req.db.client_sessions.find(
      (cst) =>
        cst.user_identifier_key === user_identifier_key &&
        cst.workspace_id === workspace_id,
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

  if (workspace_id == null) {
    throw new BadRequestException({
      type: "workspace_id_not_found",
      message: "Workspace id not found",
    })
  }

  const client_session = req.db.addClientSession({
    workspace_id,
    connect_webview_ids: req.body?.connect_webview_ids,
    connected_account_ids: req.body?.connected_account_ids,
    user_identifier_key,
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
