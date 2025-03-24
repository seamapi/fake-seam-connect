import type { Device } from "@seamapi/types/connect"
import _ from "lodash";
import { BadRequestException, NotFoundException } from "nextlove"

import type { RouteSpecRequest } from "lib/middleware/with-route-spec.ts";
import type { ClimatePreset, ClimateSetting } from "lib/zod/climate_preset.ts"
import { THERMOSTAT_DEVICE_TYPES, type ThermostatDevice, type ThermostatDeviceType } from "lib/zod/device.ts";

/**
 * Derive a climate preset from a list of available climate presets and a partial climate preset.
 * @param partial The partial climate preset.
 * @param available_climate_presets The list of available climate presets.
 * @returns A climate preset that is derived from the partial climate preset and the available climate presets.
 */
export function deriveClimateSetting(
  partial: Partial<ClimateSetting>,
  available_climate_presets: ClimateSetting[]
): ClimateSetting {
  let current_climate_setting: ClimateSetting | undefined
  if (typeof partial.climate_preset_key === "string") {
    current_climate_setting = available_climate_presets.find(
      (preset) => preset.climate_preset_key === partial.climate_preset_key
    )
    if (current_climate_setting !== undefined) {
      return { ...current_climate_setting, ...partial }
    }
  }
  if (current_climate_setting === undefined) {
    // Find the first preset that matches the partial preset
    current_climate_setting = available_climate_presets.find((preset) => {
      if (
        partial.can_edit !== undefined &&
        preset.can_edit !== partial.can_edit
      )
        return false
      if (
        partial.can_delete !== undefined &&
        preset.can_delete !== partial.can_delete
      )
        return false
      if (
        partial.fan_mode_setting !== undefined &&
        preset.fan_mode_setting !== undefined &&
        preset.fan_mode_setting !== partial.fan_mode_setting
      )
        return false
      if (
        partial.hvac_mode_setting !== undefined &&
        preset.hvac_mode_setting !== partial.hvac_mode_setting
      )
        return false
      if (
        partial.manual_override_allowed !== undefined &&
        preset.manual_override_allowed !== partial.manual_override_allowed
      )
        return false
      if (
        partial.cooling_set_point_celsius !== undefined &&
        preset.cooling_set_point_celsius !== undefined &&
        compareTemperaturesWithinTolerance(
          preset.cooling_set_point_celsius,
          partial.cooling_set_point_celsius
        ) !== 0
      )
        return false
      if (
        partial.cooling_set_point_fahrenheit !== undefined &&
        preset.cooling_set_point_fahrenheit !== undefined &&
        compareTemperaturesWithinTolerance(
          preset.cooling_set_point_fahrenheit,
          partial.cooling_set_point_fahrenheit
        ) !== 0
      )
        return false
      if (
        partial.heating_set_point_celsius !== undefined &&
        preset.heating_set_point_celsius !== undefined &&
        compareTemperaturesWithinTolerance(
          preset.heating_set_point_celsius,
          partial.heating_set_point_celsius
        ) !== 0
      )
        return false
      if (
        partial.heating_set_point_fahrenheit !== undefined &&
        preset.heating_set_point_fahrenheit !== undefined &&
        compareTemperaturesWithinTolerance(
          preset.heating_set_point_fahrenheit,
          partial.heating_set_point_fahrenheit
        ) !== 0
      )
        return false

      return true
    })
  }
  if (current_climate_setting === undefined) {
    current_climate_setting = normalizeClimateSetting({
      ...partial,
      display_name: "Manual Setting",
      manual_override_allowed: true,
    })
  }
  return current_climate_setting
}

/**
 * @param {ClimateSetting} preset
 * @returns {ClimateSetting}
 * @description
 * This function takes a Partial<ClimateSetting> and returns a new ClimateSetting with all fields filled in
 *
 */
export const normalizeClimateSetting = (
  preset: ClimateSetting
): Omit<
  ClimateSetting,
  "cooling_set_point_fahrenheit" | "heating_set_point_fahrenheit"
> => {
  if (preset.manual_override_allowed === undefined)
    throw new Error("manual_override_allowed is required")

  let normalized_climate_preset: ClimateSetting = {
    climate_preset_key: preset.climate_preset_key,
    can_edit: preset.can_edit,
    can_delete: preset.can_delete,
    name: preset.name,
    display_name: preset.name ?? preset.climate_preset_key ?? "Manual Setting",
    fan_mode_setting: preset.fan_mode_setting,
    hvac_mode_setting: preset.hvac_mode_setting,
    manual_override_allowed: preset.manual_override_allowed,
  }

  // if the climate setting calls for cooling set points, we set them
  if (
    normalized_climate_preset.hvac_mode_setting === "cool" ||
    normalized_climate_preset.hvac_mode_setting === "heat_cool"
  ) {
    normalized_climate_preset = {
      ...normalized_climate_preset,
      ...normalizeCoolingSetPoints(preset),
    }
  }

  // likewise for heating
  if (
    normalized_climate_preset.hvac_mode_setting === "heat" ||
    normalized_climate_preset.hvac_mode_setting === "heat_cool"
  ) {
    normalized_climate_preset = {
      ...normalized_climate_preset,
      ...normalizeHeatingSetPoints(preset),
    }
  }

  // remove fahrenheit set points
  const {
    cooling_set_point_fahrenheit,
    heating_set_point_fahrenheit,
    ...normalized_and_cleaned_climate_preset
  } = normalized_climate_preset

  return normalized_and_cleaned_climate_preset
}

export const deriveAutomaticHeatingEnabledFromHvacModeSetting = (
  hvac_mode_setting?: ClimateSetting["hvac_mode_setting"]
) => hvac_mode_setting === "heat" || hvac_mode_setting === "heat_cool"

export const deriveAutomaticCoolingEnabledFromHvacModeSetting = (
  hvac_mode_setting?: ClimateSetting["hvac_mode_setting"]
) => hvac_mode_setting === "cool" || hvac_mode_setting === "heat_cool"

/**
 *
 * @param preset
 * This will look at what cooling set point is on the climate setting, and set the other temperature scale if neccessary.
 * For example, if a request comes in with a cooling_set_point_ceslius, we will set the cooling_set_point_fahrenheit as well.
 *
 */
const normalizeCoolingSetPoints = (
  preset: Partial<ClimateSetting>
): Partial<ClimateSetting> => {
  const setPoints: Partial<ClimateSetting> = {}

  if (preset.cooling_set_point_celsius !== undefined) {
    setPoints.cooling_set_point_celsius = preset.cooling_set_point_celsius
  } else if (preset.cooling_set_point_fahrenheit !== undefined) {
    setPoints.cooling_set_point_celsius = convertToCelsius(
      preset.cooling_set_point_fahrenheit
    )
  }

  if (preset.cooling_set_point_fahrenheit !== undefined) {
    setPoints.cooling_set_point_fahrenheit = preset.cooling_set_point_fahrenheit
  } else if (preset.cooling_set_point_celsius !== undefined) {
    setPoints.cooling_set_point_fahrenheit = convertToFahrenheit(
      preset.cooling_set_point_celsius
    )
  }
  return setPoints
}

/**
 *
 * @param preset
 * This will look at what heating set point is on the climate setting, and set the other temperature scale.
 * For example, if a request comes in with a heating_set_point_ceslius, we will set the heating_set_point_fahrenheit as well.
 *
 */
const normalizeHeatingSetPoints = (
  preset: Partial<ClimateSetting>
): Partial<ClimateSetting> => {
  const setPoints: Partial<ClimateSetting> = {}

  if (preset.heating_set_point_celsius !== undefined) {
    setPoints.heating_set_point_celsius = preset.heating_set_point_celsius
  } else if (preset.heating_set_point_fahrenheit !== undefined) {
    setPoints.heating_set_point_celsius = convertToCelsius(
      preset.heating_set_point_fahrenheit
    )
  }

  if (preset.heating_set_point_fahrenheit !== undefined) {
    setPoints.heating_set_point_fahrenheit = preset.heating_set_point_fahrenheit
  } else if (preset.heating_set_point_celsius !== undefined) {
    setPoints.heating_set_point_fahrenheit = convertToFahrenheit(
      preset.heating_set_point_celsius
    )
  }

  return setPoints
}

export const convertToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32

export const convertToCelsius = (fahrenheit: number) =>
  (fahrenheit - 32) * (5 / 9)

export function compareTemperaturesWithinTolerance(
  a: number,
  b: number
): number {
  if (Math.abs(a - b) < 0.01) return 0
  return a - b
}

export const normalizeSetPoints = (setPoints: Partial<ClimateSetting>) => {
  return {
    ...setPoints,
    ...normalizeCoolingSetPoints(setPoints),
    ...normalizeHeatingSetPoints(setPoints),
  }
}

/**
 * Checks if the given temperature exceeds the specified thresholds.
 *
 * @param temperature_celsius - The current temperature in Celsius.
 * @param temperature_thresholds - The temperature thresholds to check against.
 * @returns An object indicating if a threshold was exceeded and the corresponding threshold temperature.
 */
export function checkTemperatureThresholds(
  temperature_celsius: number,
  temperature_thresholds: {
    lower_limit_celsius: number | null
    upper_limit_celsius: number | null
  }
): {
  threshold_exceeded: boolean
  threshold_temperature: number | null
} {
  const { lower_limit_celsius, upper_limit_celsius } = temperature_thresholds

  if (
    lower_limit_celsius !== null &&
    temperature_celsius < lower_limit_celsius
  ) {
    return {
      threshold_exceeded: true,
      threshold_temperature: lower_limit_celsius,
    }
  }
  if (
    upper_limit_celsius !== null &&
    temperature_celsius > upper_limit_celsius
  ) {
    return {
      threshold_exceeded: true,
      threshold_temperature: upper_limit_celsius,
    }
  }

  return {
    threshold_exceeded: false,
    threshold_temperature: null,
  }
}

export function isSameClimateSetting(
  currentSetting: undefined | ClimatePreset | ClimateSetting,
  desiredSetting: ClimatePreset | ClimateSetting
): boolean {
  if (currentSetting === undefined) {
    return false
  }

  return (
    currentSetting.hvac_mode_setting === desiredSetting.hvac_mode_setting &&
    currentSetting.heating_set_point_celsius ===
    desiredSetting.heating_set_point_celsius &&
    currentSetting.cooling_set_point_celsius ===
    desiredSetting.cooling_set_point_celsius
  )
}


/**
 *
 * @param climate_preset
 * @param device
 *
 * Checks if the climate setting is valid for the thermostat's current properties
 *
 */
export const throwIfClimateSettingNotAllowed = (
  climate_setting: Partial<ClimateSetting>,
  properties: Device["properties"]
) => {
  const {
    hvac_mode_setting,
    heating_set_point_celsius,
    cooling_set_point_celsius,
  } = climate_setting

  const { available_hvac_mode_settings } = properties

  const automatic_heating_enabled =
    properties.current_climate_setting === undefined
      ? false
      : properties.current_climate_setting.hvac_mode_setting === "heat" ||
      properties.current_climate_setting.hvac_mode_setting === "heat_cool"

  const automatic_cooling_enabled =
    properties.current_climate_setting === undefined
      ? false
      : properties.current_climate_setting.hvac_mode_setting === "cool" ||
      properties.current_climate_setting.hvac_mode_setting === "heat_cool"

  const is_heating_available =
    properties.available_hvac_mode_settings === undefined
      ? false
      : properties.available_hvac_mode_settings.includes("heat") ||
      properties.available_hvac_mode_settings.includes("heat_cool")
  const is_cooling_available =
    properties.available_hvac_mode_settings === undefined
      ? false
      : properties.available_hvac_mode_settings.includes("cool") ||
      properties.available_hvac_mode_settings.includes("heat_cool")

  // check against available modes

  if (
    hvac_mode_setting != null &&
    !(available_hvac_mode_settings != null && available_hvac_mode_settings.includes(hvac_mode_setting)) &&
    hvac_mode_setting !== "off"
  ) {
    throw new BadRequestException({
      type: "invalid_hvac_mode",
      message: `Invalid hvac mode for this thermostat`,
    })
  }

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
          message: `Heating set point out of range for this thermostat. The supported range is ${min_heating_set_point_celsius}°C/${convertToFahrenheit(
            min_heating_set_point_celsius
          )}°F to ${max_heating_set_point_celsius}°C/${convertToFahrenheit(
            max_heating_set_point_celsius
          )}°F`,
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
          message: `Cooling set point out of range for this thermostat. The supported range is ${min_cooling_set_point_celsius}°C/${convertToFahrenheit(
            min_cooling_set_point_celsius
          )}°F to ${max_cooling_set_point_celsius}°C/${convertToFahrenheit(
            max_cooling_set_point_celsius
          )}°F`,
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
        min_heating_cooling_delta_celsius != null &&
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

  // check against cooling_set_point_celsius < heating_set_point_celsius
  if (
    heating_set_point_celsius !== undefined &&
    cooling_set_point_celsius !== undefined &&
    !(cooling_set_point_celsius > heating_set_point_celsius)
  ) {
    throw new BadRequestException({
      type: "invalid_heating_cooling_delta",
      message: `Heating set point must be less than cooling set point for this thermostat`,
    })
  }
}

export const returnOrThrowIfNotThermostatDevice = (req: RouteSpecRequest, device_id: Device["device_id"]) => {
  const device = req.db.devices.find((device) => {
    if (
      !THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType,
      )
    ) {
      return false
    }

    return device.device_id === device_id
  })

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Device not found`,
    })
  }

  const { properties } = device;

  if (!("available_climate_presets" in properties)) {
    throw new BadRequestException({
      type: "missing_available_climate_presets",
      message: `The device does not have available climate presets`,
    })
  }

  return device as ThermostatDevice;
}