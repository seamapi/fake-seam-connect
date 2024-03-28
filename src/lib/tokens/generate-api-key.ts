import { createHash, randomBytes } from "node:crypto"
import { promisify } from "node:util"

import bs58 from "bs58"
import _ from "lodash"

const bytes_for_8char_base58 = 6 // Math.ceil(Math.log2(58 ** 8)/8)
const bytes_for_24char_base58 = 18 // Math.ceil(Math.log2(58 ** 24)/8)

export const hashLongToken = (long_token: string) =>
  createHash("sha256").update(long_token).digest("hex")

export const generateAPIKey = async () => {
  const short_token_bytes = await promisify(randomBytes)(bytes_for_8char_base58)
  const long_token_bytes = await promisify(randomBytes)(bytes_for_24char_base58)

  let short_token = _.padStart(bs58.encode(short_token_bytes), 8, "0").slice(
    0,
    8,
  )
  const long_token = _.padStart(bs58.encode(long_token_bytes), 24, "0").slice(
    0,
    24,
  )
  const long_token_hash = hashLongToken(long_token)

  short_token = "test" + short_token.slice(0, 4)

  // Make sure api keys never look like access tokens
  if (short_token.startsWith("at")) {
    short_token = `q${short_token.slice(0, -1)}`
  }

  // Make sure api keys never look like client sessions
  if (short_token.startsWith("cst")) {
    short_token = `q${short_token.slice(0, -1)}`
  }

  const token = `seam_${short_token}_${long_token}`

  return { short_token, long_token, long_token_hash, token }
}

export default generateAPIKey
