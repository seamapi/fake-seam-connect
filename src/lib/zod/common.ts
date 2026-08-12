import { z } from "zod"

const parsable_date_string = z.string().refine((payload) => {
  if (payload != null) {
    const parsed = new Date(payload)
    return parsed instanceof Date && !isNaN(parsed as unknown as number)
  }

  return true
}, "Must be parsable date string if defined")

export const timestamp = z.union([parsable_date_string, z.date()])

// A query param always arrives as a string, and the query params parser cannot
// parse a union that mixes string and date values.
export const query_timestamp = parsable_date_string

export const between_timestamps = z
  .array(query_timestamp)
  .min(2)
  .max(2)
  .refine((arr: any) => {
    return arr[0] < arr[1]
  }, "second value must be greater than first value")
