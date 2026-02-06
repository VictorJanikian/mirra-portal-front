import api from './api'
import type { AxiosResponse } from 'axios'
import type { Scheduling, SchedulingPayload } from '@/types'

function basePath(configId: string | number): string {
  return `/api/configuration/${configId}/schedulings`
}

export default {
  getAll(configId: string | number): Promise<AxiosResponse<Scheduling[]>> {
    return api.get(basePath(configId))
  },

  get(configId: string | number, schedulingId: string | number): Promise<AxiosResponse<Scheduling>> {
    return api.get(`${basePath(configId)}/${schedulingId}`)
  },

  create(configId: string | number, data: SchedulingPayload): Promise<AxiosResponse<Scheduling>> {
    return api.post(basePath(configId), data)
  },

  update(configId: string | number, schedulingId: string | number, data: SchedulingPayload): Promise<AxiosResponse<Scheduling>> {
    return api.put(`${basePath(configId)}/${schedulingId}`, data)
  },

  delete(configId: string | number, schedulingId: string | number): Promise<AxiosResponse<void>> {
    return api.delete(`${basePath(configId)}/${schedulingId}`)
  }
}
