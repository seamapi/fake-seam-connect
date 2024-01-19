import { z } from "zod"

import { custom_metadata } from "./custom-metadata.ts"

export const connected_account = z.object({
  connected_account_id: z.string(),
  workspace_id: z.string(),
  connect_webview_id: z.string(),
  user_identifier: z.object({
    email: z.string().optional(),
  }),
  provider: z.string(),
  created_at: z.string(),
  account_type: z.string().optional(),
  account_type_display_name: z.string(),
  automatically_manage_new_devices: z.boolean(),
  custom_metadata: custom_metadata.optional(),

  assa_abloy_credential_service_id: z.string().optional(),
})

export type ConnectedAccount = z.infer<typeof connected_account>
