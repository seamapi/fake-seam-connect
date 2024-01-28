import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema,
  invitation_schema_type,
} from "lib/zod/invitations.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    invitation_id: z.string(),
    invitation_type: invitation_schema_type,
  }),
  jsonResponse: z.object({
    invitation: invitation_schema,
  }),
} as const)(async (req, res) => {
  const state = req.db.getState()

  const { client_session_id, workspace_id } = req.auth

  const { invitation_id, invitation_type, custom_sdk_installation_id } =
    req.body

  const installation = state.getPhoneSdkInstallation({
    ext_sdk_installation_id: custom_sdk_installation_id,
    workspace_id,
    client_session_id,
  })

  if (installation === undefined) {
    throw new NotFoundException({
      message: "Phone SDK installation not found",
      type: "phone_sdk_installation_not_found",
    })
  }

  let invitation = state
    .getInvitations({
      client_session_id: req.auth.client_session_id,
      phone_sdk_installation_id: installation.phone_sdk_installation_id,
    })
    .find(
      (invitation) =>
        invitation.invitation_id === invitation_id &&
        invitation.invitation_type === invitation_type,
    )

  if (invitation === undefined) {
    throw new NotFoundException({
      message: "Invitation not found",
      type: "invitation_not_found",
    })
  }

  // If invitation code has not been created, assign it
  if (invitation?.invitation_code === undefined) {
    invitation = state.assignInvitationCode({
      invitation_id,
    })
  }

  const endpoint = req.db.addEndpoint({
    assa_abloy_credential_service_id:
      invitation.assa_abloy_credential_service_id ?? "",
    invitation_id: invitation.invitation_id,
  })

  res.status(200).json({
    invitation: {
      invitation_id: invitation.invitation_id,
      invitation_type: invitation.invitation_type,
      invitation_code: invitation.invitation_code,
      ext_assa_abloy_cs_endpoint_id: endpoint.endpoint_id,
    },
  })
})
