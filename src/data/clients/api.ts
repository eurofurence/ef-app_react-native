import axios from 'axios'
import { authClient } from "@/data/clients/auth";

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
  if (authClient.tokenResponse?.accessToken)
    config.headers.Authorization = `Bearer ${authClient.tokenResponse.accessToken}`;
  return config
})
