import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { public_endpoint_schema } from "lib/zod/endpoints.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
  }),
  jsonResponse: z.object({
    endpoints: z.array(public_endpoint_schema),
  }),
} as const)(async (req, res) => {
  const { custom_sdk_installation_id } = req.body
  const { client_session_id, workspace_id } = req.auth

  const installation = req.db.getState().getPhoneSdkInstallation({
    workspace_id,
    ext_sdk_installation_id: custom_sdk_installation_id,
    client_session_id,
  })

  if (installation === undefined) {
    throw new NotFoundException({
      message: "Phone SDK installation not found",
      type: "phone_sdk_installation_not_found",
    })
  }

  const endpoints = req.db
    .getState()
    .getEndpoints({
      client_session_id,
      phone_sdk_installation_id: installation.phone_sdk_installation_id,
    })
    .map((endpoint) => ({
      ...endpoint,
      invitation_id: undefined,
    }))

  res.status(200).json({
    endpoints,
  })
})
