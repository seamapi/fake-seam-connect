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
    },
  )

  t.true(climate_setting_schedule.manual_override_allowed)
  t.true(climate_setting_schedule.automatic_heating_enabled)
  t.true(climate_setting_schedule.automatic_cooling_enabled)
  t.is(climate_setting_schedule.heating_set_point_fahrenheit, 40)
  t.is(climate_setting_schedule.cooling_set_point_fahrenheit, 80)

  const {
    data: { climate_setting_schedules: schedules_list },
  } = await axios.post(
    "/thermostats/climate_setting_schedules/list",
    {
      device_id,
    },
    {
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(schedules_list.length, 1)
  const schedule_from_list = schedules_list[0]

  t.true(schedule_from_list?.manual_override_allowed)
  t.true(schedule_from_list?.automatic_heating_enabled)
  t.true(schedule_from_list?.automatic_cooling_enabled)
  t.is(schedule_from_list?.heating_set_point_fahrenheit, 40)
  t.is(schedule_from_list?.cooling_set_point_fahrenheit, 80)

  const {
    data: { climate_setting_schedule: schedule_from_get },
  } = await axios.get("/thermostats/climate_setting_schedules/get", {
    params: {
      climate_setting_schedule_id:
        climate_setting_schedule.climate_setting_schedule_id,
    },
    headers: {
      Authorization: `Bearer ${seed.ws2.cst}`,
    },
  })

  t.true(schedule_from_get?.manual_override_allowed)
  t.true(schedule_from_get?.automatic_heating_enabled)
  t.true(schedule_from_get?.automatic_cooling_enabled)
  t.is(schedule_from_get?.heating_set_point_fahrenheit, 40)
  t.is(schedule_from_get?.cooling_set_point_fahrenheit, 80)
})
