import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema_assa_abloy,
  invitation_schema_hid,
  phone_device_metadata_schema,
} from "lib/zod/invitations.ts"
import type { PhoneInvitation } from "lib/zod/phone.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    phone_os: z.enum(["ios", "android"]),
    phone_device_metadata: phone_device_metadata_schema.optional(),
  }),
  jsonResponse: z.object({
    invitations: z.array(
      z.discriminatedUnion("invitation_type", [
        invitation_schema_assa_abloy.omit({ invitation_code: true }),
        invitation_schema_hid.omit({ invitation_code: true }),
      ]),
    ),
  }),
} as const)(async (req, res) => {
  const { client_session_id, workspace_id } = req.auth

  const { custom_sdk_installation_id } = req.body

  const state = req.db.getState()

  let installation = state.getPhoneSdkInstallation({
    ext_sdk_installation_id: custom_sdk_installation_id,
    workspace_id,
    client_session_id,
  })

  if (installation === undefined) {
    installation = state.addPhoneSdkInstallation({
      ext_sdk_installation_id: custom_sdk_installation_id,
      client_session_id,
      workspace_id,
    })
  }

  const existing_invitations = state.getInvitations({
    phone_sdk_installation_id: installation.phone_sdk_installation_id,
    client_session_id,
  })

  const enrollment_automations = state.getEnrollmentAutomations({
    client_session_id,
  })

  const ids_of_services_needing_invitations: string[] = []

  const invitations: PhoneInvitation[] = []

  if (enrollment_automations.length > 0) {
    for (const enrollment_automation of enrollment_automations) {
      const existing_invitation = existing_invitations.find(
        (invitation) =>
          invitation.assa_abloy_credential_service_id ===
            enrollment_automation.assa_abloy_credential_service_id &&
          invitation.user_identity_id === installation?.user_identity_id,
      )

      if (existing_invitation === undefined) {
        ids_of_services_needing_invitations.push(
          enrollment_automation.assa_abloy_credential_service_id,
        )
      } else {
        invitations.push(existing_invitation)
      }
    }
  }

  if (ids_of_services_needing_invitations.length > 0) {
    for (const service_id of ids_of_services_needing_invitations) {
      const new_invitation = state.addInvitation({
        client_session_id,
        invitation_type: "assa_abloy_credential_service",
        phone_sdk_installation_id: installation.phone_sdk_installation_id,
        workspace_id,
        assa_abloy_credential_service_id: service_id,
      })

      invitations.push(new_invitation)
    }
  }

  res.status(200).json({
    invitations: invitations.map((invitation) => ({
      invitation_id: invitation.invitation_id,
      invitation_type: invitation.invitation_type,
      invitation_code: invitation.invitation_code,
    })),
  })
})
