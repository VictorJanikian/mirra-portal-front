import { PLATFORM_INSTAGRAM } from '@/types'
import type { Configuration } from '@/types'

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

/**
 * Name of a connection as shown across the app: the site/profile name the user
 * gave it, except on Instagram, where the linked account handle stands in for it.
 */
export function formatConfigurationName(configuration: Configuration): string {
  if (configuration.PlatformId === PLATFORM_INSTAGRAM && configuration.InstagramUsername) {
    return '@' + configuration.InstagramUsername
  }
  return configuration.PlatformName || ''
}
