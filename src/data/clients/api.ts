import axios from 'axios'
import { useAuthStore } from '@/data/clients/auth'

const url = 'https://app.test.eurofurence.org/EF30-ve17v92UFFfJk/Api'
//'https://app.eurofurence.org/EF29/Api'
// todo figure this out
export const apiS = axios.create({
  baseURL: url,
})

export const api = axios.create({
  baseURL: url,
})

api.interceptors.request.use(config => {
  const { tokenResponse } = useAuthStore.getState()
  if (tokenResponse?.accessToken)
    config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`
  return config
})
