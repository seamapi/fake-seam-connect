import { z } from "zod"

export const endpoint_schema_hid = z.object({
  endpoint_type: z.literal("hid_credential_manager"),
  endpoint_id: z.string(),
})

export const endpoint_schema_assa_abloy = z.object({
  endpoint_type: z.literal("assa_abloy_credential_service"),
  endpoint_id: z.string(),
  is_active: z.boolean(),
  seos_tsm_endpoint_id: z.number().nullable(),
})

export const endpoint_schema = z.discriminatedUnion("endpoint_type", [
  endpoint_schema_hid,
  endpoint_schema_assa_abloy,
])