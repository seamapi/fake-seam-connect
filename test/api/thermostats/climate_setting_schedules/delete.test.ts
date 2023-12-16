import test, { type ExecutionContext } from "ava"

import { getTestServer } from "fixtures/get-test-server.ts"

test("DELETE /thermostats/climate_setting_schedules/delete", async (t: ExecutionContext) => {
  const { axios, seed, db } = await getTestServer(t)
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

  const res = await axios.delete(
    "/thermostats/climate_setting_schedules/delete",
    {
      data: {
        climate_setting_schedule_id:
          climate_setting_schedule.climate_setting_schedule_id,
      },
      headers: {
        Authorization: `Bearer ${seed.ws2.cst}`,
      },
    },
  )

  t.is(res.status, 200)

  const deleted = db.findClimateSettingSchedule({
    climate_setting_schedule_id:
      climate_setting_schedule.climate_setting_schedule_id,
  })

  t.falsy(deleted) // removed from db
})
