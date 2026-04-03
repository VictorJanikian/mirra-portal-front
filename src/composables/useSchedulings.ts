import { ref } from 'vue'
import schedulingService from '@/services/schedulingService'
import configurationService from '@/services/configurationService'
import type { Scheduling, SchedulingPayload } from '@/types'

export function useSchedulings(configId: string | number) {
  const schedulings = ref<Scheduling[]>([])
  const current = ref<Scheduling | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await configurationService.get(configId)
      schedulings.value = data.Schedulings || []
    } catch (e: unknown) {
      const err = e as { response?: { data?: { Message?: string } } }
      error.value = err.response?.data?.Message || 'Failed to load schedules'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(schedulingId: string | number): Promise<Scheduling | undefined> {
    loading.value = true
    error.value = null
    try {
      const { data } = await schedulingService.get(configId, schedulingId)
      current.value = data
      return data
    } catch (e: unknown) {
      const err = e as { response?: { data?: { Message?: string } } }
      error.value = err.response?.data?.Message || 'Failed to load schedule'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: SchedulingPayload): Promise<Scheduling> {
    const { data } = await schedulingService.create(configId, payload)
    schedulings.value.push(data)
    return data
  }

  async function update(schedulingId: string | number, payload: SchedulingPayload): Promise<Scheduling> {
    const { data } = await schedulingService.update(configId, schedulingId, payload)
    const index = schedulings.value.findIndex(s => s.Id === schedulingId)
    if (index !== -1) schedulings.value[index] = data
    return data
  }

  async function remove(schedulingId: string | number): Promise<void> {
    await schedulingService.delete(configId, schedulingId)
    schedulings.value = schedulings.value.filter(s => s.Id !== schedulingId)
  }

  return { schedulings, current, loading, error, fetchAll, fetchOne, create, update, remove }
}
