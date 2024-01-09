import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema,
  invitation_schema_type,
} from "lib/zod/invitations.ts"

export default withRouteSpec({
  auth: "cst_ak_pk", // TODO: client_session
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    invitation_id: z.string().uuid(),
    invitation_type: invitation_schema_type,
  }),
  jsonResponse: z.object({
    invitation: invitation_schema,
  }),
} as const)(async (_req, res) => {
  const { workspace_id } = _req.auth
  const { invitation_id, invitation_type, custom_sdk_installation_id } =
    _req.body

  const state = _req.db.getState()

  const installation = state.getPhoneSdkInstallation({
    ext_sdk_installation_id: custom_sdk_installation_id,
    workspace_id,
  })

  if (installation === undefined) {
    throw new NotFoundException({
      message: "Phone SDK installation not found",
      type: "phone_sdk_installation_not_found",
    })
  }

  const invitation = state.getInvitation({
    invitation_id,
    invitation_type,
    phone_sdk_installation_id: installation.phone_sdk_installation_id,
  })

  if (invitation === undefined) {
    throw new NotFoundException({
      message: "Invitation not found",
      type: "invitation_not_found",
    })
  }

  res.status(200).json({
    invitation: {
      invitation_id: invitation.invitation_id,
      invitation_type: invitation.invitation_type,
      invitation_code: invitation.invitation_code,
    },
  })
})
