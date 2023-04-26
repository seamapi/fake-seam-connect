import { z } from "zod"

export const event = z.object({
  event_id: z.string().uuid(),
  device_id: z.string().uuid().optional(),
  event_type: z.string(),
  workspace_id: z.string().uuid(),
  created_at: z.date(),
  occurred_at: z.date(),
})

export const connect_webview_event = z.object({
  connect_webview_event_code: z.string(),
  message: z.union([z.string(), z.null()]),
  expected_duration_ms: z.union([z.number(), z.null()]),
  created_at: z.string().datetime(),
})
