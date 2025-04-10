import { randomUUID } from "node:crypto"

import { z } from "zod"

import { invitation_schema_type } from "./invitations.ts"

export const phone_sdk_installation = z.object({
  phone_sdk_installation_id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  device_id: z.string(),
  user_identity_id: z.string(),
  ext_sdk_installation_id: z.string(),
  workspace_id: z.string(),
})
export type PhoneSdkInstallation = z.infer<typeof phone_sdk_installation>

export const phone_invitation = z.object({
  user_identity_id: z.string(),
  invitation_id: z
    .string()
    .uuid()
    .default(() => randomUUID()),
  invitation_type: invitation_schema_type,
  phone_sdk_installation_id: z.string().uuid(),
  workspace_id: z.string(),
  invitation_code: z.string().optional(),

  assa_abloy_credential_service_id: z.string().optional(),
})
export type PhoneInvitation = z.infer<typeof phone_invitation>
