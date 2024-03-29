import { z } from "zod"

export const acs_entrance = z.object({
  acs_entrance_id: z.string(),
  display_name: z.string(),
  acs_system_id: z.string(),
  workspace_id: z.string(),
  created_at: z.string().datetime(),
  properties: z.record(z.any()),
  visionline_metadata: z
    .object({
      door_name: z.string(),
      door_category: z.enum([
        "entrance",
        "guest",
        "elevator reader",
        "common",
        "common (PMS)",
      ]),
      profiles: z
        .array(
          z.object({
            visionline_door_profile_id: z.string(),
            visionline_door_profile_type: z.enum([
              "BLE",
              "commonDoor",
              "touch",
            ]),
          }),
        )
        .optional(),
    })
    .nullable(),
})

export type AcsEntrance = z.infer<typeof acs_entrance> & {
  _acs_user_ids: string[]
}
