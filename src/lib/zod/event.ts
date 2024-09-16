import { z } from "zod"

export const event = z.object({
  event_id: z.string(),
  device_id: z.string().optional(),
  access_code_id: z.string().optional(),
  connected_account_id: z.string().optional(),
  event_type: z.string(),
  workspace_id: z.string(),
  created_at: z.string().datetime(),
  occurred_at: z.string().datetime(),
  event_description: z.string(),
})

export const connect_webview_event = z.object({
  connect_webview_event_code: z.string(),
  message: z.union([z.string(), z.null()]),
  expected_duration_ms: z.union([z.number(), z.null()]),
  created_at: z.string().datetime(),
})

export type Event = z.infer<typeof event> & Record<string, any>
