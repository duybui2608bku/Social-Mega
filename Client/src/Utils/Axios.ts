import axios, { AxiosError, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/Types/Auth.type'
import {
  clearLS,
  getAccessTokenFormLS,
  getRefreshTokenFormLS,
  saveAccessTokenToLS,
  saveRefreshTokenToLS
} from 'src/Utils/Auth'

let access_token = getAccessTokenFormLS()
let refresh_token = getRefreshTokenFormLS()
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (access_token && config.headers) {
      config.headers.Authorization = access_token
      return config
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  function (response) {
    const { url } = response.config

    if (url === 'users/login' || url === 'users/register') {
      access_token = (response.data as AuthResponse).result.access_token
      refresh_token = (response.data as AuthResponse).result.refresh_token
      saveAccessTokenToLS(access_token)
      saveRefreshTokenToLS(refresh_token)
    } else if (url === 'users/logout') {
      access_token = ''
      saveAccessTokenToLS('')
      clearLS()
    }
    return response
  },
  function (error: AxiosError) {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      const data: any | undefined = error.response?.data
      const message = data.message || error.message
      toast.error(message)
    }
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      clearLS()
      window.location.reload
    }
    return Promise.reject(error)
  }
)
export default axiosInstance
