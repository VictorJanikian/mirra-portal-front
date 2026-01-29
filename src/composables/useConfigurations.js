import { ref } from 'vue'
import configurationService from '@/services/configurationService'

const configurations = ref([])
const loading = ref(false)
const error = ref(null)

export function useConfigurations() {
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { data } = await configurationService.getAll()
      configurations.value = data
    } catch (e) {
      error.value = e.response?.data?.message || 'Erro ao carregar configurações'
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    const { data } = await configurationService.create(payload)
    configurations.value.push(data)
    return data
  }

  function getByPlatform(platformId) {
    return configurations.value.filter(c => c.PlatformId === platformId)
  }

  return { configurations, loading, error, fetchAll, create, getByPlatform }
}
