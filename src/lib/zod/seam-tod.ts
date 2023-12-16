import { z } from "zod"

const timeRegex =
  /^(?:[01]\d|2[0-3])(?::[0-5]\d){2}(?:\[[A-Za-z]+(?:[ _][A-Za-z]+)*\/[A-Za-z]+(?:[ _][A-Za-z]+)*])?$/

export const seam_tod = z
  .string()
  .regex(
    timeRegex,
    'Invalid time format. Must be in the format of "HH:mm:ss[time_zone]", where time_zone is in the format of "Region/City"',
  )
