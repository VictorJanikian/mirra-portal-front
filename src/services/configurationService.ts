import api from './api'
import type { AxiosResponse } from 'axios'
import type { Configuration, ConfigurationCreatePayload } from '@/types'

export default {
  getAll(): Promise<AxiosResponse<Configuration[]>> {
    return api.get('/api/configuration')
  },

  get(configId: string | number): Promise<AxiosResponse<Configuration>> {
    return api.get(`/api/configuration/${configId}`)
  },

  create(data: ConfigurationCreatePayload): Promise<AxiosResponse<Configuration>> {
    return api.post('/api/configuration', data)
  }
}
