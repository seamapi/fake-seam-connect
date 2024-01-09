import generateAPIKey from "./generate-api-key.ts"

/**
 * Access tokens use prefixed_api_key format but have some variations from api
 * keys to increase their usability.
 *
 * * Access tokens start with "seam_at*"
 * * Access tokens are versioned with the first three characters of the
 *   short_token
 * * Access tokens have 11 character short tokens
 */
export const generateAccessToken = async () => {
  const api_key = await generateAPIKey()

  const short_token = `at1${api_key.short_token}`
  const { long_token } = api_key

  return {
    short_token,
    long_token,
    long_token_hash: api_key.long_token_hash,
    token: `seam_${short_token}_${long_token}`,
  }
}
