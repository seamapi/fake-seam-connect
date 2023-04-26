import { z } from 'zod'

export const service_health_response = z.object({
  ok: z.literal(true),
  last_service_evaluation_at: z.string(),
  service_health: z.object({
    service: z.string(),
    status: z.union([
      z.literal('healthy'),
      z.literal('degraded'),
      z.literal('down'),
    ]),
    description: z.string(),
  }),
})
