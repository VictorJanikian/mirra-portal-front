import { ref } from 'vue'
import schedulingService from '@/services/schedulingService'

export function useSchedulings(configId) {
  const schedulings = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await schedulingService.getAll(configId)
      schedulings.value = data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erro ao carregar agendamentos'
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(schedulingId) {
    loading.value = true
    error.value = null
    try {
      const { data } = await schedulingService.get(configId, schedulingId)
      current.value = data
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erro ao carregar agendamento'
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const { data } = await schedulingService.create(configId, payload)
    schedulings.value.push(data)
    return data
  }

  async function update(schedulingId, payload) {
    const { data } = await schedulingService.update(configId, schedulingId, payload)
    const index = schedulings.value.findIndex(s => s.Id === schedulingId)
    if (index !== -1) schedulings.value[index] = data
    return data
  }

  async function remove(schedulingId) {
    await schedulingService.delete(configId, schedulingId)
    schedulings.value = schedulings.value.filter(s => s.Id !== schedulingId)
  }

  return { schedulings, current, loading, error, fetchAll, fetchOne, create, update, remove }
}
