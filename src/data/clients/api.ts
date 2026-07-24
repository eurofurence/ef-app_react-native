import axios from 'axios'
import { auth } from '@/data/clients/auth'
import { apiBase } from '@/configuration'

/**
 * App API client with base URL. Uses the global AuthClient's instance for access tokens, unless requests specify
 * `Authorization: false` as a header.
 */
export const api = axios.create({
  baseURL: apiBase,
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
