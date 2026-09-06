import api from './api'
import type { AxiosResponse } from 'axios'
import type { Configuration, ConfigurationCreatePayload, ConfigurationUpdatePayload, InstagramStartResponse } from '@/types'

export default {
  getAll(): Promise<AxiosResponse<Configuration[]>> {
    return api.get('/api/configuration')
  },

  get(configId: string | number): Promise<AxiosResponse<Configuration>> {
    return api.get(`/api/configuration/${configId}`)
  },

  create(data: ConfigurationCreatePayload): Promise<AxiosResponse<Configuration>> {
    return api.post('/api/configuration', data)
  },

  update(configId: string | number, data: ConfigurationUpdatePayload): Promise<AxiosResponse<Configuration>> {
    return api.put(`/api/configuration/${configId}`, data)
  },

  delete(configId: string | number): Promise<AxiosResponse<void>> {
    return api.delete(`/api/configuration/${configId}`)
  },

  /**
   * Asks the backend for the Instagram authorization URL. Answers 200 with the
   * URL in the body — the SPA then navigates to it — instead of redirecting,
   * so the call carries the usual bearer token and no cross-origin redirect is
   * ever followed by XHR.
   */
  startInstagram(): Promise<AxiosResponse<InstagramStartResponse>> {
    return api.get('/api/configuration/instagram/start')
  }
}
