import api from './api'
import type { AxiosResponse } from 'axios'
import type { Configuration, ConfigurationCreatePayload, ConfigurationUpdatePayload } from '@/types'

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
  }
}
