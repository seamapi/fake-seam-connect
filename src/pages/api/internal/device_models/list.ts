import MiniSearch from "minisearch"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { device_model } from "lib/zod/device_model.ts"

const searchFields = [
  "model_name",
  "manufacturer_model_id",
  "connection_type",
  "support_level",
]

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  queryParams: z.object({
    main_category: z.string().optional(),
    support_level: z.string().optional(),
    brand: z.string().optional(),
    text_search: z.string().optional(),
  }),
  jsonResponse: z.object({
    device_models: z.array(device_model),
  }),
} as const)(async (req, res) => {
  const minisearch = new MiniSearch({
    fields: searchFields,
    storeFields: searchFields,
    idField: "manufacturer_model_id",
  })
  minisearch.addAll(fake_device_models)

  let device_models = [...fake_device_models]
  if (req.query.text_search) {
    device_models = minisearch.search(req.query.text_search) as any
  }

  if (req.query.support_level != null) {
    device_models = device_models.filter(
      (dm) =>
        dm.support_level.toLowerCase() ===
        req.query.support_level?.toLowerCase()
    )
  }

  if (req.query.brand != null) {
    device_models = device_models.filter(
      (dm) => dm.brand.toLowerCase() === req.query.brand?.toLowerCase()
    )
  }

  res.status(200).json({ device_models })
})

const fake_device_models: Array<z.infer<typeof device_model>> = [
  {
    main_category: "smartlocks",
    brand: "august",
    model_name: "Smart Lock 2nd Generation",
    manufacturer_model_id: "AUG-SL02-M02-S02-C",
    support_level: "live",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "wifi",
  },
  {
    main_category: "smartlocks",
    brand: "yale",
    model_name: "Assure Lock SL with Z-Wave Plus",
    manufacturer_model_id: "YRD256-ZW2-619",
    support_level: "live",
    icon_url:
      "https://seam.co/_next/image?url=%2Fimg%2Fdevice-db%2Fyale%2Fsmartlocks%2Fyale_assure-lock-sl-with-z-wave-plus_satin-nickel_front.png&w=96&q=75",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "zwave",
  },
  {
    main_category: "smartlocks",
    brand: "lockly",
    model_name: "Secure Pro Smart Lock",
    manufacturer_model_id: "PGD728WMB",
    support_level: "live",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "wifi",
  },
  {
    main_category: "smartlocks",
    brand: "lockly",
    model_name: "Secure Pro Smart Lock",
    manufacturer_model_id: "PGD628WSN",
    support_level: "live",
    icon_url:
      "https://seam.co/_next/image?url=%2Fimg%2Fdevice-db%2Flockly%2Fsmartlocks%2Flockly_secure-pro_latch-smart-lock_satin-nickel_front.png&w=96&q=75",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "wifi",
  },
  {
    main_category: "smartlocks",
    brand: "acmelock",
    model_name: "Keep out",
    manufacturer_model_id: "ABCDEFG",
    support_level: "beta",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "zigbee",
  },
  {
    main_category: "smartlocks",
    brand: "acmelock",
    model_name: "Innout",
    manufacturer_model_id: "1234",
    support_level: "unsupported",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "unknown",
  },
  {
    main_category: "smartlocks",
    brand: "acmelock",
    model_name: "Dunno",
    manufacturer_model_id: "12345",
    support_level: "unsupported",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "unknown",
  },
  {
    main_category: "smartlocks",
    brand: "acmelock",
    model_name: "Not here",
    manufacturer_model_id: "123456",
    support_level: "unsupported",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "unknown",
  },
  {
    main_category: "smartlocks",
    brand: "acmelock",
    model_name: "Another one",
    manufacturer_model_id: "1234567",
    support_level: "unsupported",
    icon_url: "https://connect.getseam.com/images/devices/unknown-lock.png",
    seam_device_model_page_url: "https://seam.co",
    connection_type: "unknown",
  },
]
