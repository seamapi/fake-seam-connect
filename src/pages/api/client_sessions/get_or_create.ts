import { BadRequestException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

import { client_session } from "lib/zod/client_session.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
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

  const { workspace_id } = req.auth

  const user_identifier_key =
    req.body?.user_identifier_key ??
    (req.headers["user-identifier-key"] as string | undefined) ??
    (req.headers["seam-user-identifier-key"] as string | undefined)

  if (user_identifier_key == null) {
    throw new BadRequestException({
      type: "missing_user_identifier_key",
      message: "You must provide a user_identifier_key",
    })
  }

  if (user_identifier_key != null) {
    const existing_cs = req.db.client_sessions.find(
      (cst) =>
        cst.user_identifier_key === user_identifier_key &&
        cst.workspace_id === workspace_id,
    )
    if (existing_cs != null) {
      const device_count = req.db.devices.filter(
        (d) =>
          d?.connected_account_id !== undefined &&
          existing_cs.connected_account_ids.includes(d.connected_account_id),
      ).length

      res.json({
        client_session: {
          ...existing_cs,
          device_count,
        },
        ok: true,
      })
      return
    }
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
