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
    }),
  ),
  warnings: z.array(
    z.object({
      warning_code: z.string(),
      message: z.string(),
    }),
  ),
  is_managed: z.boolean(),
  is_backup: z.boolean().optional(),
  pulled_backup_access_code_id: z.string().nullable().optional(),
  is_backup_access_code_available: z.boolean(),
  is_external_modification_allowed: z.boolean(),
  is_one_time_use: z.boolean(),
  is_offline_access_code: z.boolean(),
})

export const access_code_managed = access_code_base.extend({
  common_code_key: z.string().nullable().optional(),
})

export const access_code_managed_ongoing = access_code_managed.extend({
  type: z.literal("ongoing"),
  created_at: z.string().datetime(),
  status: z.enum(["setting", "set", "removing", "unset", "unknown"]),
})

export const access_code_managed_time_bound = access_code_managed.extend({
  type: z.literal("time_bound"),
  created_at: z.string().datetime(),
  status: z.enum(["setting", "set", "removing", "unset", "unknown"]),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
})

export const access_code_unmanaged = access_code_base.extend({
  status: z.literal("set"),
  created_at: z.string().datetime(),
})

export const access_code_unmanaged_ongoing = access_code_unmanaged.extend({
  status: z.literal("set"),
  type: z.literal("ongoing"),
})

export const access_code_unmanaged_time_bound = access_code_unmanaged.extend({
  status: z.enum(["set", "unset"]),
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
