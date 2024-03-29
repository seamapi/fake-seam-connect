import { z } from "zod"

export const endpoint_schema_hid = z.object({
  endpoint_type: z.literal("hid_credential_manager"),
  endpoint_id: z.string(),
})

export const endpoint_schema_assa_abloy = z.object({
  endpoint_type: z.literal("assa_abloy_credential_service"),
  endpoint_id: z.string(),
  invitation_id: z.string(),
  is_active: z.boolean(),
  seos_tsm_endpoint_id: z.number().nullable(),
  assa_abloy_credential_service_id: z.string(),
})

export const public_endpoint_schema_assa_abloy =
  endpoint_schema_assa_abloy.omit({
    invitation_id: true,
    assa_abloy_credential_service_id: true,
  })

export const endpoint_schema = z.discriminatedUnion("endpoint_type", [
  endpoint_schema_hid,
  endpoint_schema_assa_abloy,
])

export const public_endpoint_schema = z.discriminatedUnion("endpoint_type", [
  endpoint_schema_hid,
  public_endpoint_schema_assa_abloy,
])

export type Endpoint = z.infer<typeof endpoint_schema>
export type PublicEndpoint = z.infer<typeof public_endpoint_schema>
