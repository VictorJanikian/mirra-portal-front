import api from './api'
import type { AxiosResponse } from 'axios'
import type { SubscriptionPlan, UserSubscription } from '@/types'

export default {
  getPlans(): Promise<AxiosResponse<SubscriptionPlan[]>> {
    return api.get('/api/subscription/plans')
  },

  getUserSubscription(): Promise<AxiosResponse<UserSubscription>> {
    return api.get('/api/Customer/subscription')
  }
}
