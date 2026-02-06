import axios, { type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('mirra_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mirra_token')
      localStorage.removeItem('mirra_user')
      router.push({ name: 'Login' })
    }
    return Promise.reject(error)
  }
)

export default api
