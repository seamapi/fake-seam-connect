import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema,
  invitation_schema_type,
} from "lib/zod/invitations.ts"

/**
 * This fake implementation skips user_identity and
 * uses client_session_id to look up the phone installation.
 */
export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    invitation_id: z.string().uuid(),
    invitation_type: invitation_schema_type,
  }),
  jsonResponse: z.object({
    invitation: invitation_schema,
  }),
} as const)(async (req, res) => {
  const { auth_mode } = req.auth

  if (auth_mode !== "client_session_token") {
    throw new NotFoundException({
      message: `Auth Mode ${
        (auth_mode as string) ?? "undefined"
      } not implemented`,
      type: "not_implemented",
    })
  }

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
