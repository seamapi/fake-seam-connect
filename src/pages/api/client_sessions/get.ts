import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { client_session } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    client_session_id: z.string().optional(),
    user_identifier_key: z.string().optional(),
  }),
  jsonResponse: z.object({
    client_session,
  }),
} as const)(async (req, res) => {
  const { commonParams, auth } = req

  const is_client_session =
    req.auth.auth_mode === "client_session_token" && "client_session_id" in auth

  if (
    is_client_session &&
    commonParams.client_session_id != null &&
    commonParams.user_identifier_key != null
  ) {
    throw new BadRequestException({
      type: "invalid_options",
      message:
        "Cannot send client_session_id or user_identifier_key params when using a client session token",
    })
  }

  const client_session_id = is_client_session
    ? auth.client_session_id
    : commonParams.client_session_id

  const user_identifier_key = is_client_session
    ? undefined
    : commonParams.user_identifier_key

  const client_session = req.db.client_sessions.find(
    (d) =>
      d.client_session_id === client_session_id ||
      (d.user_identifier_key != null &&
        d.user_identifier_key === user_identifier_key),
  )

  if (client_session == null) {
    throw new NotFoundException({
      type: "client_session_not_found",
      message: "Could not find client session",
    })
  }

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
  })
})
