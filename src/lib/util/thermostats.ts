import type { ClimateSetting } from "lib/zod/climate_setting.ts"
import { ThermostatDevice } from "lib/zod/device.ts"
import { BadRequestException } from "nextlove"

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

export const throwIfClimateSettingNotAllowed = (
  climate_setting: Partial<ClimateSetting>,
  properties: ThermostatDevice["properties"]
) => {
  const {
    heating_set_point_celsius,
    cooling_set_point_celsius,
    automatic_cooling_enabled,
    automatic_heating_enabled,
  } = climate_setting

  const { is_heating_available, is_cooling_available, manufacturer } =
    properties

  // TODO: support nest
  if (manufacturer === "nest") return

  // check against heating range
  if (automatic_heating_enabled && heating_set_point_celsius !== undefined) {
    if (is_heating_available) {
      const { min_heating_set_point_celsius, max_heating_set_point_celsius } =
        properties

      if (
        min_heating_set_point_celsius !== undefined &&
        max_heating_set_point_celsius !== undefined &&
        !_.inRange(
          heating_set_point_celsius,
          min_heating_set_point_celsius,
          max_heating_set_point_celsius
        )
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
  if (automatic_cooling_enabled && cooling_set_point_celsius !== undefined) {
    if (is_cooling_available) {
      const { min_cooling_set_point_celsius, max_cooling_set_point_celsius } =
        properties

      if (
        min_cooling_set_point_celsius !== undefined &&
        max_cooling_set_point_celsius !== undefined &&
        !_.inRange(
          cooling_set_point_celsius,
          min_cooling_set_point_celsius,
          max_cooling_set_point_celsius
        )
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
    automatic_cooling_enabled &&
    automatic_heating_enabled &&
    heating_set_point_celsius !== undefined &&
    cooling_set_point_celsius !== undefined
  ) {
    if (is_cooling_available && is_heating_available) {
      const { min_heating_cooling_delta_celsius } = properties

      if (
        min_heating_cooling_delta_celsius &&
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
