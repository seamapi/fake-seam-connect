import { z } from "zod"

export const bridge_client_session = z.object({
  created_at: z.string().datetime(),
  bridge_client_session_id: z.string(),
  bridge_client_session_token: z.string(),
  _ext_tailscale_auth_key_id: z.string().nullable(),
  pairing_code: z.string().length(6),
  pairing_code_expires_at: z.string().datetime(),
  tailscale_hostname: z.string(),
  tailscale_auth_key: z.string().nullable(),
  _tailscale_auth_key_expires_at: z.string().datetime().nullable(),
  bridge_client_name: z.string(),
  bridge_client_time_zone: z.string(),
  bridge_client_machine_identifier_key: z.string(),
  _last_status_report_received_at: z.string().datetime().nullable(),
})

export type BridgeClientSession = z.infer<typeof bridge_client_session>
