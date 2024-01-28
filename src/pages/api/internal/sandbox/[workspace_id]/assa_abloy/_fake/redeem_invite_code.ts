import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  credential_service_endpoint,
  credential_service_endpoint_details,
} from "lib/zod/assa_abloy_credential_service.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    invite_code: z.string(),
    endpoint_details: credential_service_endpoint_details.omit({
      seos_tsm_endpoint_id: true,
    }),
  }),
  jsonResponse: z.object({
    endpoint: credential_service_endpoint,
  }),
} as const)(async (req, res) => {
  const invitation = req.db.getInvitationByCode({
    invitation_code: req.body.invite_code,
  })

  if (
    invitation?.assa_abloy_credential_service_id === undefined ||
    invitation?.invitation_code === undefined
  ) {
    throw new Error("Invalid invitation!")
  }

  const invitation_endpoint = req.db.endpoints.find(
    (endpoint) =>
      endpoint.endpoint_type === "assa_abloy_credential_service" &&
      endpoint.invitation_id === invitation.invitation_id,
  )

  if (invitation_endpoint == null) {
    throw new Error(
      `No endpoint found with invitation id: ${invitation.invitation_id}`,
    )
  }

  req.db.activateEndpoint({
    endpoint_id: invitation_endpoint.endpoint_id,
    invitation_code: invitation.invitation_code,
  })

  res.status(200).json({
    endpoint: {
      endpoint_id: invitation_endpoint.endpoint_id,
      status: "ACTIVE",
      invite_code: invitation.invitation_code,
    },
  })
})
