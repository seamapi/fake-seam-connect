import { z } from "zod"

export const credential_service = z.object({
  service_id: z.string(),
  workspace_id: z.string(),
})

export type CredentialService = z.infer<typeof credential_service>

export const pending_credential_service_endpoing_details = z.object({
  seos_tsm_endpoint_id: z.number(),
})

export const credential_service_endpoint_details = z.object({
  ble_capability: z.boolean(),
  hce_capability: z.boolean(),
  nfc_capability: z.boolean(),
  device_manufacturer: z.string(),
  application_version: z.string(),
  device_model: z.string(),
  seos_applet_version: z.string(),
  os_version: z.string(),
  seos_tsm_endpoint_id: z.number(),
})
export type CredentialServiceEndpointDetails = z.infer<
  typeof credential_service_endpoint_details
>

export const credential_service_endpoint = z.object({
  endpoint_id: z.string(),
  invite_code: z.string(),
  status: z.enum([
    "INVITATION_PENDING",
    "INVITATION_INVALID",
    "ACKNOWLEDGED",
    "ACTIVATING",
    "ACTIVATION_FAILURE",
    "ACTIVE",
    "TERMINATED",
    "TERMINATING_FAILURE",
  ]),
  details: z
    .union([
      credential_service_endpoint_details,
      pending_credential_service_endpoing_details,
    ])
    .optional(),
})

const door_operation = z.object({
  doors: z.array(z.string()),
  operation: z.literal("guest"), // todo: additional values?
})

export const timestamp = z.string().regex(/^\d{8}T\d{4}$/)

export const card = z.object({
  cancelled: z.boolean(),
  cardHolder: z.string(),
  created: timestamp,
  discarded: z.boolean(),
  doorOperations: z.array(door_operation),
  expireTime: timestamp,
  endpointId: z.string(),
  // todo: update when past expireTime?
  expired: z.boolean(),
  format: z.enum(["TLCode", "rfid48"]),
  // String version of uniqueRegistrationNumber
  id: z.string(),
  notIssued: z.boolean(),
  numberOfIssuedCards: z.number(),
  overridden: z.boolean(),
  overwritten: z.boolean(),
  pendingAutoUpdate: z.boolean(),
  serialNumbers: z.array(z.string()),
  startTime: timestamp,
  // todo: are the two below always the same? is it related to the credential service?
  uniqueRegistrationNumber: z.number(),
  credentialID: z.number(),
})

export type AssaAbloyCard = z.infer<typeof card>

export const simulated_event = z.object({
  simulated_event_type: z.enum(["tap"]),
  reader_id: z.number(),
  card_number: z.string(),
  timestamp: z.string(),
})

export type SimulatedEvent = z.infer<typeof simulated_event>
