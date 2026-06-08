import axios from 'axios'
import { auth } from '@/data/clients/auth'

const url = 'https://app.test.eurofurence.org/EF30-ve17v92UFFfJk/Api'
//'https://app.eurofurence.org/EF29/Api'

/**
 * App API client with base URL. Uses the global AuthClient's instance for access tokens, unless requests specify
 * `Authorization: false` as a header.
 */
export const api = axios.create({
  baseURL: url,
})

api.interceptors.request.use((config) => {
  // Set to false. Delete and return in place to force anonymous request.
  if (config.headers.Authorization === false) {
    delete config.headers.Authorization
    return config
  }

  // If auth client has a response with a token, use that.
  if (auth.state.tokenResponse?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.state.tokenResponse.accessToken}`
    return config
  }

  // Return as is.
  return config
})
