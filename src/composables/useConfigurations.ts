import { ref } from 'vue'
import configurationService from '@/services/configurationService'
import type { Configuration, ConfigurationCreatePayload, ConfigurationUpdatePayload } from '@/types'

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
      const err = e as { response?: { data?: { Message?: string } } }
      error.value = err.response?.data?.Message || 'Failed to load connections'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: ConfigurationCreatePayload): Promise<Configuration> {
    const { data } = await configurationService.create(payload)
    configurations.value.push(data)
    return data
  }

  async function update(configId: number, payload: ConfigurationUpdatePayload): Promise<Configuration> {
    const { data } = await configurationService.update(configId, payload)
    const index = configurations.value.findIndex(c => c.Id === configId)
    if (index !== -1) configurations.value[index] = data
    return data
  }

  async function remove(configId: number): Promise<void> {
    await configurationService.delete(configId)
    configurations.value = configurations.value.filter(c => c.Id !== configId)
  }

  function getByPlatform(platformId: number): Configuration[] {
    return configurations.value.filter(c => c.PlatformId === platformId)
  }

  /**
   * Starts the Instagram connection flow: asks the backend for the authorization
   * URL and sends the browser to it. Instagram sends the user back to the portal
   * home once the profile is authorized.
   */
  async function startInstagramConnection(): Promise<void> {
    const { data } = await configurationService.startInstagram()
    const url = data?.redirectUrl || data?.RedirectUrl
    if (!url) throw new Error('Failed to start the Instagram connection')
    window.location.href = url
  }

  return {
    configurations,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    getByPlatform,
    startInstagramConnection
  }
}
