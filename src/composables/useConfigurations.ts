import { ref } from 'vue'
import configurationService from '@/services/configurationService'
import type { Configuration, ConfigurationCreatePayload } from '@/types'

const configurations = ref<Configuration[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useConfigurations() {
  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await configurationService.getAll()
      configurations.value = data
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message || 'Erro ao carregar conexões'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: ConfigurationCreatePayload): Promise<Configuration> {
    const { data } = await configurationService.create(payload)
    configurations.value.push(data)
    return data
  }

  function getByPlatform(platformId: number): Configuration[] {
    return configurations.value.filter(c => c.PlatformId === platformId)
  }

  return { configurations, loading, error, fetchAll, create, getByPlatform }
}
