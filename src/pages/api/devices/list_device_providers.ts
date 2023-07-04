import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const device_provider = z.object({
  device_provider_name: z.string(),
  display_name: z.string(),
  image_url: z.string(),
  provider_categories: z.array(
    z.union([z.literal("stable"), z.literal("internal_beta")])
  ),
})

const device_providers: Array<z.infer<typeof device_provider>> = [
  {
    device_provider_name: "august",
    display_name: "August",
    image_url: `https://connect.getseam.com/assets/images/logos/august_logo_square.png`,
    provider_categories: [],
  },
  {
    device_provider_name: "yale",
    display_name: "Yale",
    image_url: `https://connect.getseam.com/assets/images/logos/yale_logo_square.png`,
    provider_categories: [],
  },
  {
    device_provider_name: "lockly",
    display_name: "Lockly",
    image_url: `https://connect.getseam.com/assets/images/logos/lockly_logo_square.png`,
    provider_categories: [],
  },
]

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({}),
  jsonResponse: z.object({
    device_providers: z.array(device_provider),
  }),
} as const)(async (_req, res) => {
  res.status(200).json({ device_providers })
})
