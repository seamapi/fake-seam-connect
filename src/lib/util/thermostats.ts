import { BadRequestException } from "nextlove"
import { z } from "zod"

import type { ClimateSetting } from "lib/zod/climate_setting.ts"
import type { Device } from "lib/zod/device.ts"

export type ClimateSettingMode = Pick<
  ClimateSetting,
  | "automatic_cooling_enabled"
  | "automatic_heating_enabled"
  | "hvac_mode_setting"
>

export const normalizeClimateSettingMode = (
  cs: Partial<ClimateSetting>
): ClimateSettingMode => {
  return {
    automatic_heating_enabled:
      cs.automatic_heating_enabled ??
      deriveAutomaticHeatingEnabledFromHvacModeSetting(cs.hvac_mode_setting),
    automatic_cooling_enabled:
      cs.automatic_cooling_enabled ??
      deriveAutomaticCoolingEnabledFromHvacModeSetting(cs.hvac_mode_setting),
    hvac_mode_setting:
      cs.hvac_mode_setting ??
      deriveHvacModeSettingFromFlags({
        automatic_cooling_enabled: cs.automatic_cooling_enabled ?? false,
        automatic_heating_enabled: cs.automatic_heating_enabled ?? false,
      }),
  }
}

/**
 * @param {ClimateSetting} cs
 * @returns {ClimateSetting}
 * @description
 * This function takes a Partial<ClimateSetting> and returns a new ClimateSetting with all fields filled in
 *
 */
export const normalizeClimateSetting = (
  cs: Partial<ClimateSetting>
): ClimateSetting => {
  if (cs.manual_override_allowed === undefined)
    throw new Error("manual_override_allowed is required")

  let normalized_climate_setting: ClimateSetting = {
    ...normalizeClimateSettingMode(cs),
    manual_override_allowed: cs.manual_override_allowed,
  }

  // if the climate setting calls for cooling set points, we set them
  if (normalized_climate_setting.automatic_cooling_enabled) {
    normalized_climate_setting = {
      ...normalized_climate_setting,
      ...normalizeCoolingSetPoints(cs),
    }
  }

  // likewise for heating
  if (normalized_climate_setting.automatic_heating_enabled) {
    normalized_climate_setting = {
      ...normalized_climate_setting,
      ...normalizeHeatingSetPoints(cs),
    }
  }

  return normalized_climate_setting
}

export const deriveAutomaticHeatingEnabledFromHvacModeSetting = (
  hvac_mode_setting?: ClimateSetting["hvac_mode_setting"]
): boolean => hvac_mode_setting === "heat" || hvac_mode_setting === "heat_cool"

export const deriveAutomaticCoolingEnabledFromHvacModeSetting = (
  hvac_mode_setting?: ClimateSetting["hvac_mode_setting"]
): boolean => hvac_mode_setting === "cool" || hvac_mode_setting === "heat_cool"

export const deriveHvacModeSettingFromFlags = ({
  automatic_cooling_enabled,
  automatic_heating_enabled,
}: {
  automatic_cooling_enabled: boolean
  automatic_heating_enabled: boolean
}): ClimateSetting["hvac_mode_setting"] => {
  if (automatic_cooling_enabled && automatic_heating_enabled) return "heat_cool"
  if (automatic_cooling_enabled) return "cool"
  if (automatic_heating_enabled) return "heat"
  return "off"
}

/**
 *
 * @param cs
 * @returns {Partial<ClimateSetting>}
 * This will look at what cooling set point is on the climate setting, and set the other temperature scale if neccessary.
 * For example, if a request comes in with a cooling_set_point_ceslius, we will set the cooling_set_point_fahrenheit as well.
 *
 */
const normalizeCoolingSetPoints = (
  cs: Partial<ClimateSetting>
): Partial<ClimateSetting> => {
  const setPoints: Partial<ClimateSetting> = {}

  if (cs.cooling_set_point_celsius !== undefined) {
    setPoints.cooling_set_point_celsius = cs.cooling_set_point_celsius
  } else if (cs.cooling_set_point_fahrenheit !== undefined) {
    setPoints.cooling_set_point_celsius = convertToCelsius(
      cs.cooling_set_point_fahrenheit
    )
  }

  if (cs.cooling_set_point_fahrenheit !== undefined) {
    setPoints.cooling_set_point_fahrenheit = cs.cooling_set_point_fahrenheit
  } else if (cs.cooling_set_point_celsius !== undefined) {
    setPoints.cooling_set_point_fahrenheit = convertToFahrenheit(
      cs.cooling_set_point_celsius
    )
  }
  return setPoints
}

/**
 *
 * @param cs
 * @returns {Partial<ClimateSetting>}
 * This will look at what heating set point is on the climate setting, and set the other temperature scale.
 * For example, if a request comes in with a heating_set_point_ceslius, we will set the heating_set_point_fahrenheit as well.
 *
 */
const normalizeHeatingSetPoints = (
  cs: Partial<ClimateSetting>
): Partial<ClimateSetting> => {
  const setPoints: Partial<ClimateSetting> = {}

  if (cs.heating_set_point_celsius !== undefined) {
    setPoints.heating_set_point_celsius = cs.heating_set_point_celsius
  } else if (cs.heating_set_point_fahrenheit !== undefined) {
    setPoints.heating_set_point_celsius = convertToCelsius(
      cs.heating_set_point_fahrenheit
    )
  }

  if (cs.heating_set_point_fahrenheit !== undefined) {
    setPoints.heating_set_point_fahrenheit = cs.heating_set_point_fahrenheit
  } else if (cs.heating_set_point_celsius !== undefined) {
    setPoints.heating_set_point_fahrenheit = convertToFahrenheit(
      cs.heating_set_point_celsius
    )
  }

  return setPoints
}

export const convertToFahrenheit = (celsius: number): number =>
  (celsius * 9) / 5 + 32

export const convertToCelsius = (fahrenheit: number): number =>
  (fahrenheit - 32) * (5 / 9)

/**
 *
 * This checks if a Partial<ClimateSetting> can be interpreted as a valid thermostat setting
 * We run this check so that we can reject ambiguous settings.
 * We could allow partial updates to ClimateSettings, but this creates some complexity around updating the actual device
 * Ex. For Nest, you can only set `coolCelsius` is the mode is already set to `COOL`.
 * Therefore, it's easier at this time to require a mode setting and corresponding set points on every request.
 *
 * We use a superRefine here so that if one check fails, we can bail early
 * Eg. If the mode described here is invalid, we don't need to return any errors about the set points.
 */
export const refineClimateSetting = <T extends z.AnyZodObject>(
  b: T
): z.ZodEffects<T, Record<string, any>, Record<string, any>> =>
  b.superRefine(
    (
      {
        automatic_heating_enabled,
        automatic_cooling_enabled,
        hvac_mode_setting,
        cooling_set_point_celsius,
        heating_set_point_celsius,
        cooling_set_point_fahrenheit,
        heating_set_point_fahrenheit,
        manual_override_allowed,
      },
      ctx
    ) => {
      if (
        automatic_cooling_enabled === undefined &&
        automatic_heating_enabled === undefined &&
        hvac_mode_setting === undefined &&
        manual_override_allowed === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Must provide at least one of automatic_heating_enabled, automatic_cooling_enabled, or hvac_mode_setting",
          fatal: true,
        })

        return z.NEVER
      }

      const is_a_flag_set =
        automatic_heating_enabled !== undefined ||
        automatic_cooling_enabled !== undefined

      if (
        hvac_mode_setting !== undefined &&
        is_a_flag_set &&
        deriveHvacModeSettingFromFlags({
          automatic_heating_enabled: Boolean(automatic_heating_enabled),
          automatic_cooling_enabled: Boolean(automatic_cooling_enabled),
        }) !== hvac_mode_setting
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "hvac_mode_setting must be consistent with automatic_heating_enabled and automatic_cooling_enabled",
          fatal: true,
        })

        return z.NEVER
      }

      // at this stage, we know we have a valid mode

      const heating_set_point_required =
        automatic_heating_enabled ??
        deriveAutomaticHeatingEnabledFromHvacModeSetting(hvac_mode_setting)

      const cooling_set_point_required =
        automatic_cooling_enabled ??
        deriveAutomaticCoolingEnabledFromHvacModeSetting(hvac_mode_setting)

      // now we can check the set points

      // "off"
      if (
        heating_set_point_required === false &&
        cooling_set_point_required === false &&
        (heating_set_point_celsius !== undefined ||
          heating_set_point_fahrenheit !== undefined ||
          cooling_set_point_celsius !== undefined ||
          cooling_set_point_fahrenheit !== undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cannot provide set points when thermostat is off",
          fatal: true,
        })

        return z.NEVER
      }

      // at this point, we need at least one set point

      if (
        (cooling_set_point_celsius !== undefined &&
          cooling_set_point_fahrenheit !== undefined) ??
        (heating_set_point_celsius !== undefined &&
          heating_set_point_fahrenheit !== undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Cannot provide both celsius and fahrenheit values for the same set point",
          fatal: true,
        })

        return z.NEVER
      }

      if (
        heating_set_point_required === true &&
        heating_set_point_celsius == null &&
        heating_set_point_fahrenheit == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Heating set point required with this mode",
          fatal: true,
        })
      }

      if (
        cooling_set_point_required === true &&
        cooling_set_point_celsius == null &&
        cooling_set_point_fahrenheit == null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cooling set point required with this mode",
          fatal: true,
        })
      }
    }
  )

/**
 *
 * @param climate_setting
 * @param device
 *
 * Checks if the climate setting is valid for the thermostat's current properties
 *
 */
export const throwIfClimateSettingNotAllowed = (
  climate_setting: Partial<ClimateSetting>,
  properties: Device["properties"]
): void => {
  const {
    heating_set_point_celsius,
    cooling_set_point_celsius,
    automatic_cooling_enabled,
    automatic_heating_enabled,
  } = climate_setting

  if (!("is_heating_available" in properties)) {
    throw new BadRequestException({
      type: "device_is_not_thermostat",
      message: `Device is not a thermostat`,
    })
  }

  const { is_heating_available, is_cooling_available, manufacturer } =
    properties

  // TODO: support nest
  if (manufacturer === "nest") return

  // check against heating range
  if (
    automatic_heating_enabled === true &&
    heating_set_point_celsius !== undefined
  ) {
    if (is_heating_available) {
      const { min_heating_set_point_celsius, max_heating_set_point_celsius } =
        properties

      if (
        min_heating_set_point_celsius !== undefined &&
        max_heating_set_point_celsius !== undefined &&
        (heating_set_point_celsius < min_heating_set_point_celsius ||
          heating_set_point_celsius > max_heating_set_point_celsius)
      ) {
        throw new BadRequestException({
          type: "heating_set_point_out_of_range",
          message: `Heating set point out of range for this thermostat`,
        })
      }
    } else {
      throw new BadRequestException({
        type: "heat_mode_not_available",
        message: `'heat' mode is not available for this thermostat`,
      })
    }
  }

  // check against cooling range
  if (
    automatic_cooling_enabled === true &&
    cooling_set_point_celsius !== undefined
  ) {
    if (is_cooling_available) {
      const { min_cooling_set_point_celsius, max_cooling_set_point_celsius } =
        properties

      if (
        min_cooling_set_point_celsius !== undefined &&
        max_cooling_set_point_celsius !== undefined &&
        (cooling_set_point_celsius < min_cooling_set_point_celsius ||
          cooling_set_point_celsius > max_cooling_set_point_celsius)
      ) {
        throw new BadRequestException({
          type: "cooling_set_point_out_of_range",
          message: `Cooling set point out of range for this thermostat`,
        })
      }
    } else {
      throw new BadRequestException({
        type: "cool_mode_not_available",
        message: `'cool' mode is not available for this thermostat`,
      })
    }
  }

  // check against heat_cool delta
  if (
    automatic_cooling_enabled === true &&
    automatic_heating_enabled === true &&
    heating_set_point_celsius !== undefined &&
    cooling_set_point_celsius !== undefined
  ) {
    if (is_cooling_available && is_heating_available) {
      const { min_heating_cooling_delta_celsius } = properties

      if (
        min_heating_cooling_delta_celsius !== 0 &&
        Math.abs(heating_set_point_celsius - cooling_set_point_celsius) <
          min_heating_cooling_delta_celsius
      ) {
        throw new BadRequestException({
          type: "invalid_heating_cooling_delta",
          message: `Difference between set points must be more than ${min_heating_cooling_delta_celsius}°C/${convertToFahrenheit(
            min_heating_cooling_delta_celsius
          )}°F  for this thermostat`,
        })
      }
    } else {
      throw new BadRequestException({
        type: "heat_cool_not_available",
        message: `'heat_cool' mode is not available for this thermostat`,
      })
    }
  }
}
