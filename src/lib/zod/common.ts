import { z } from "zod"

export const timestamp = z.union([
  z.string().refine((payload) => {
    if (payload) {
      const parsed = new Date(payload)
      return parsed instanceof Date && !isNaN(parsed as any)
    }

    return true
  }, "Must be parsable date string if defined"),
  z.date(),
])

export const between_timestamps = z
  .array(timestamp)
  .min(2)
  .max(2)
  .refine((arr: any) => {
    return arr[0] < arr[1]
  }, "second value must be greater than first value")
