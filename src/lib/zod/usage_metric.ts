import { z } from 'zod'

export const period_length = z.enum(['hour', 'day', 'week', 'month', 'year'])

export const usage_metric = z.object({
  usage_metric_type: z.string(),
  display_name: z.string(),
  description: z.string(),
  aggregation_type: z.enum(['max', 'sum']),
  period_length,
  usage_periods: z.array(
    z.object({
      started_at: z.string().datetime(),
      ended_at: z.string().datetime(),
      usage_value: z.number(),
    })
  ),
})
