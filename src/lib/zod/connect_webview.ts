import { z } from "zod"

export const device_providers = z.enum([
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

export const connect_webview = z.object({
  connect_webview_id: z.string(),
  workspace_id: z.string(),
  status: z.enum(["pending", "authorized", "failed"]),
  accepted_providers: z.array(device_providers).optional(),
  connected_account_id: z.string().optional(),
  created_at: z.string(),
  custom_redirect_url: z.string().nullable(),
})

export type ConnectWebview = z.infer<typeof connect_webview>
