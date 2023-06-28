import { z } from "zod"

export const access_code_base = z.object({
  access_code_id: z.string(),
  device_id: z.string(),
  name: z.string(),
  code: z.string(),
  errors: z.array(
    z.object({
      error_code: z.string(),
      message: z.string(),
    })
  ),
  warnings: z.array(
    z.object({
      warning_code: z.string(),
      message: z.string(),
    })
  ),
  is_backup: z.boolean(),
})

export const access_code_managed = access_code_base.extend({
  common_code_key: z.string().nullable().optional(),
})

export const access_code_managed_ongoing = access_code_managed.extend({
  type: z.literal("ongoing"),
  created_at: z.string().datetime(),
  status: z.enum(["setting", "set", "removing", "unset"]),
})

export const access_code_managed_time_bound = access_code_managed.extend({
  type: z.literal("time_bound"),
  created_at: z.string().datetime(),
  status: z.enum(["setting", "set", "removing", "unset"]),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
})

export const access_code_unmanaged = access_code_base.extend({
  status: z.literal("set"),
  created_at: z.string().datetime(),
})

export const access_code_unmanaged_ongoing = access_code_unmanaged.extend({
  type: z.literal("ongoing"),
})

export const access_code_unmanaged_time_bound = access_code_unmanaged.extend({
  type: z.literal("time_bound"),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
})

export const access_code = z.union([
  access_code_managed_ongoing,
  access_code_managed_time_bound,
  access_code_unmanaged_ongoing,
  access_code_unmanaged_time_bound,
])

export type AccessCode = z.infer<typeof access_code>
