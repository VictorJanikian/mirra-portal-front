import api from './api'
import type { AxiosResponse } from 'axios'
import type { AuthResponse } from '@/types'

export default {
  login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/api/account/login', { Email: email, Password: password })
  },

  register(name: string, email: string, password: string): Promise<AxiosResponse<void>> {
    return api.post('/api/account/register', { Name: name, Email: email, Password: password })
  },

  activate(email: string, code: string): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/api/account/activate', { Email: email, Code: code })
  },

  forgotPassword(email: string): Promise<AxiosResponse<void>> {
    return api.post('/api/account/forgot-password', { Email: email })
  },

  resetPassword(email: string, code: string, newPassword: string): Promise<AxiosResponse<AuthResponse>> {
    return api.post('/api/account/reset-password', { Email: email, Code: code, NewPassword: newPassword })
  }
}
