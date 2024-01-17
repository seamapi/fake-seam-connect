import { z } from "zod"

import { custom_metadata } from "./custom-metadata.ts"

export const device_provider = z.enum([
  "akuvox",
  "august",
  "avigilon_alta",
  "brivo",
  "butterflymx",
  "schlage",
  "smartthings",
  "yale",
  "genie",
  "doorking",
  "salto",
  "lockly",
  "ttlock",
  "linear",
  "noiseaware",
  "nuki",
  "seam_relay_admin",
  "igloo",
  "kwikset",
  "minut",
  "my_2n",
  "controlbyweb",
  "nest",
  "igloohome",
  "ecobee",
  "hubitat",
  "four_suites",
  "dormakaba_oracode",
  "pti",
  "wyze",
])

export type DeviceProvider = z.infer<typeof device_provider>

export const connect_webview = z.object({
  connect_webview_id: z.string(),
  url: z.string().url(),
  workspace_id: z.string(),
  status: z.enum(["pending", "authorized", "failed"]),
  accepted_providers: z.array(device_provider).optional(),
  connected_account_id: z.string().nullable(),
  created_at: z.string(),
  custom_redirect_url: z.string().nullable(),
  custom_redirect_failure_url: z.string().nullable(),
  device_selection_mode: z.enum(["none", "single", "multiple"]),
  accepted_devices: z.array(z.string()),
  any_provider_allowed: z.boolean(),
  any_device_allowed: z.boolean().nullable(),
  login_successful: z.boolean(),
  custom_metadata,
  automatically_manage_new_devices: z.boolean(),
  wait_for_device_creation: z.boolean(),
})

export type ConnectWebview = z.infer<typeof connect_webview>
