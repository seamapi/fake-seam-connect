import { DateTime } from "luxon"
import { ZonedTime } from "zoned-time"

import type { Device } from "lib/zod/device.ts"
import type { NoiseThreshold } from "lib/zod/noise_threshold.ts"

export const NOISE_SENSOR_DEVICE_TYPE = {
  NOISEAWARE_ACTIVITY_ZONE: "noiseaware_activity_zone",
  MINUT_SENSOR: "minut_sensor",
} as const

type NoiseSensorDeviceTypeFromMapping =
  (typeof NOISE_SENSOR_DEVICE_TYPE)[keyof typeof NOISE_SENSOR_DEVICE_TYPE]

export const NOISE_SENSOR_DEVICE_TYPE_LIST = Object.values(
  NOISE_SENSOR_DEVICE_TYPE,
) as NoiseSensorDeviceTypeFromMapping[]

function isCurrentTimeInRange(starts_daily_at: string, ends_daily_at: string) {
  const starts_daily_at_zoned = ZonedTime.from(starts_daily_at)
  const ends_daily_at_zoned = ZonedTime.from(ends_daily_at)

  const now = DateTime.now().setZone(
    starts_daily_at_zoned.getTimeZone().toString(),
  )

  const startTime = now.set({
    hour: starts_daily_at_zoned.hour,
    minute: starts_daily_at_zoned.minute,
    second: starts_daily_at_zoned.second,
  })

  let endTime = now.set({
    hour: ends_daily_at_zoned.hour,
    minute: ends_daily_at_zoned.minute,
    second: ends_daily_at_zoned.second,
  })

  if (endTime <= startTime) {
    endTime = endTime.plus({ days: 1 })
  }

  if (startTime <= now && now <= endTime) {
    return true
  }

  const nextDayStartTime = startTime.plus({ days: 1 })
  if (now <= endTime && now >= nextDayStartTime) {
    return true
  }

  return false
}

export const getCurrentlyTriggeringNoiseThresholds = ({
  properties,
  noise_thresholds,
}: {
  properties: Device["properties"]
  noise_thresholds: NoiseThreshold[]
}): string[] => {
  let noise_level_decibels: number | undefined =
    "noise_level_decibels" in properties
      ? properties.noise_level_decibels
      : undefined

  if (noise_level_decibels == null) {
    return []
  }

  const currently_triggering_noise_threshold_ids: string[] = []

  for (const noise_threshold of noise_thresholds) {
    const { starts_daily_at, ends_daily_at } = noise_threshold

    const is_noise_level_above_threshold =
      noise_level_decibels >= Number(noise_threshold.noise_threshold_decibels)

    if (
      is_noise_level_above_threshold &&
      isCurrentTimeInRange(starts_daily_at, ends_daily_at)
    ) {
      currently_triggering_noise_threshold_ids.push(
        noise_threshold.noise_threshold_id,
      )
    }
  }

  return currently_triggering_noise_threshold_ids
}
