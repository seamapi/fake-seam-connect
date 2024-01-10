import { z } from "zod"

export const phone_device_metadata_schema = z.object({
  os_version: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
})

export const invitation_schema_hid = z.object({
  invitation_type: z.literal("hid_credential_manager"),
  invitation_id: z.string(),
  invitation_code: z.string().optional(),
})

export const invitation_schema_assa_abloy = z.object({
  invitation_type: z.literal("assa_abloy_credential_service"),
  invitation_id: z.string(),
  invitation_code: z.string().optional(),
})

export const invitation_schema = z.discriminatedUnion("invitation_type", [
  invitation_schema_hid,
  invitation_schema_assa_abloy,
])

export const invitation_schema_type = z.union([
  invitation_schema_hid.shape.invitation_type,
  invitation_schema_assa_abloy.shape.invitation_type,
])
