import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { endpoint_schema, public_endpoint_schema } from "lib/zod/endpoints.ts"
import { publicMapEndpoint } from "lib/util/public-mapping/public-map-endpoint.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    // user can provide endpoint_id to force a sync when there is no endpoint_id
    // in our DB
    endpoint_id: z.string(),
  }),
  jsonResponse: z.object({
    endpoint: public_endpoint_schema.optional(),
  }),
} as const)(async (req, res) => {
  const { client_session_id, workspace_id } = req.auth
  const { custom_sdk_installation_id, endpoint_id } = req.body

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

  const endpoint = req.db
    .getState()
    .getEndpoints({
      phone_sdk_installation_id: installation.phone_sdk_installation_id,
      client_session_id,
    })
    .find((endpoint) => endpoint.endpoint_id === endpoint_id)

  res.status(200).json({
    endpoint: endpoint != null ? publicMapEndpoint(endpoint) : undefined,
  })
})
