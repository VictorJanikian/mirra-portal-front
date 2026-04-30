import { ref, computed } from 'vue'
import subscriptionService from '@/services/subscriptionService'
import type { SubscriptionPlan, UserSubscription } from '@/types'

const plans = ref<SubscriptionPlan[]>([])
const userSubscription = ref<UserSubscription | null>(null)
const remainingConfigurations = ref<number>(1)
const loading = ref(false)
const error = ref<string | null>(null)

export function useSubscription() {
  const canCreateConfig = computed(() => remainingConfigurations.value > 0)

  const sortedPlans = computed(() =>
    [...plans.value].sort((a, b) => a.DefaultPrice - b.DefaultPrice)
  )

  const currentPlan = computed(() =>
    plans.value.find(p => p.Id === userSubscription.value?.SubscriptionPlanId) || null
  )

  const highestPlan = computed(() => {
    if (plans.value.length === 0) return null
    return [...plans.value].sort((a, b) => b.DefaultPrice - a.DefaultPrice)[0]
  })

  const isOnHighestPlan = computed(() =>
    currentPlan.value !== null && currentPlan.value.Id === highestPlan.value?.Id
  )

  const isOnFreePlan = computed(() =>
    userSubscription.value?.SubscriptionPlanId === 0
  )

  async function fetchPlans(): Promise<void> {
    const { data } = await subscriptionService.getPlans()
    plans.value = data
  }

  async function fetchUserSubscription(): Promise<void> {
    const { data } = await subscriptionService.getUserSubscription()
    userSubscription.value = data
  }

  async function fetchRemainingConfigurations(): Promise<void> {
    try {
      const { data } = await subscriptionService.getRemainingConfigurations()
      remainingConfigurations.value = data.remainingConfigurations
    } catch {
      remainingConfigurations.value = 0
    }
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await Promise.all([fetchPlans(), fetchUserSubscription()])
    } catch (e: unknown) {
      const err = e as { response?: { data?: { Message?: string } } }
      error.value = err.response?.data?.Message || 'Failed to load plans'
    } finally {
      loading.value = false
    }
  }

  return {
    plans, userSubscription, remainingConfigurations, loading, error,
    sortedPlans, currentPlan, highestPlan, isOnHighestPlan, isOnFreePlan, canCreateConfig,
    fetchPlans, fetchUserSubscription, fetchRemainingConfigurations, fetchAll
  }
}
