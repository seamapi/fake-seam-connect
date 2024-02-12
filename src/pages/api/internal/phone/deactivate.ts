import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["DELETE", "POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { custom_sdk_installation_id } = req.body

  const { client_session_id, workspace_id } = req.auth

  const state = req.db.getState()

  const phone_sdk_installation = state.getPhoneSdkInstallation({
    ext_sdk_installation_id: custom_sdk_installation_id,
    workspace_id,
    client_session_id,
  })

  if (phone_sdk_installation === undefined) {
    res.status(404).json({})
    return
  }

  const invitations = state.getInvitations({
    phone_sdk_installation_id: phone_sdk_installation.phone_sdk_installation_id,
    client_session_id,
  })

  // delete all invitations
  for (const invitation of invitations) {
    const index = state.phone_invitations.indexOf(invitation)
    state.phone_invitations.splice(index, 1)
  }

  const endpoints = state.getEndpoints({
    phone_sdk_installation_id: phone_sdk_installation.phone_sdk_installation_id,
    client_session_id,
  })

  // delete all endpoints
  for (const endpoint of endpoints) {
    const index = state.endpoints.indexOf(endpoint)
    state.endpoints.splice(index, 1)
  }

  const index = state.phone_sdk_installations.indexOf(phone_sdk_installation)
  if (index !== -1) {
    state.phone_sdk_installations.splice(index, 1)
  }

  res.status(200).json({})
})
