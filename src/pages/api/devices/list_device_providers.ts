import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const provider_category = z.union([
  z.literal("stable"),
  z.literal("consumer_smartlocks"),
])
const device_provider = z.object({
  device_provider_name: z.string(),
  display_name: z.string(),
  image_url: z.string(),
  provider_categories: z.array(provider_category),
})

const device_providers: Array<z.infer<typeof device_provider>> = [
  {
    device_provider_name: "august",
    display_name: "August",
    image_url: `https://connect.getseam.com/assets/images/logos/august_logo_square.png`,
    provider_categories: ["stable", "consumer_smartlocks"],
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
  commonParams: z.object({
    provider_category: provider_category.optional(),
  }),
  jsonResponse: z.object({
    device_providers: z.array(device_provider),
  }),
} as const)(async (req, res) => {
  const { provider_category } = req.commonParams

  res.status(200).json({
    device_providers: device_providers.filter((dp) =>
      provider_category == null
        ? true
        : dp.provider_categories.includes(provider_category),
    ),
  })
})
