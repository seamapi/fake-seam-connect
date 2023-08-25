import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("POST /thermostats/climate_setting_schedules/create", async (t: ExecutionContext) => {
  const { axios, seed } = await getTestServer(t)
  const device_id = seed.ws2.device1_id
  const {
    data: { climate_setting_schedule },
  } = await axios.post(
    "/thermostats/climate_setting_schedules/create",
    {
      device_id,
      name: "Vacation Setting (Hawaii)",
      schedule_starts_at: "2021-01-01T00:00:00.000Z",
      schedule_ends_at: "2021-02-02T00:00:00.000Z",
      schedule_type: "time_bound",
      manual_override_allowed: true,
      automatic_heating_enabled: true,
      automatic_cooling_enabled: true,
      heating_set_point_fahrenheit: 40,
      cooling_set_point_fahrenheit: 80,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.true(climate_setting_schedule.manual_override_allowed)
  t.true(climate_setting_schedule.automatic_heating_enabled)
  t.true(climate_setting_schedule.automatic_cooling_enabled)
  t.is(climate_setting_schedule.heating_set_point_fahrenheit, 40)
  t.is(climate_setting_schedule.cooling_set_point_fahrenheit, 80)

  const {
    data: { climate_setting_schedule: updated_schedule },
  } = await axios.post(
    "/thermostats/climate_setting_schedules/update",
    {
      climate_setting_schedule_id:
        climate_setting_schedule.climate_setting_schedule_id,
      name: "BALI",
      schedule_ends_at: "2021-04-04T00:00:00.000Z",
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.is(updated_schedule.name, "BALI")
  t.is(updated_schedule.schedule_ends_at, "2021-04-04T00:00:00.000Z")

  const {
    data: { climate_setting_schedule: updated_schedule2 },
  } = await axios.post(
    "/thermostats/climate_setting_schedules/update",
    {
      climate_setting_schedule_id:
        climate_setting_schedule.climate_setting_schedule_id,
      manual_override_allowed: false,
      automatic_heating_enabled: true,
      heating_set_point_fahrenheit: 68,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    }
  )

  t.false(updated_schedule2.manual_override_allowed)
  t.true(updated_schedule2.automatic_heating_enabled)
  t.false(updated_schedule2.automatic_cooling_enabled)
  t.is(updated_schedule2.heating_set_point_fahrenheit, 68)
})
