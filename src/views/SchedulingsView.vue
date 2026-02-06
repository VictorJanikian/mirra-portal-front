<template>
  <div class="schedulings-view">
    <div class="schedulings-view__header">
      <router-link to="/" class="schedulings-view__back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Dashboard
      </router-link>
      <h1 class="schedulings-view__title">Agendamentos Ativos</h1>
      <p class="schedulings-view__subtitle">Todos os agendamentos de todas as suas configurações.</p>
    </div>

    <div v-if="loading" class="schedulings-view__loading">
      <span class="spinner" style="border-color: rgba(37,99,235,0.2); border-top-color: #2563eb;" />
      <span>Carregando...</span>
    </div>

    <div v-else-if="allSchedulings.length === 0" class="schedulings-view__empty">
      <div class="schedulings-view__empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#cbd5e1" stroke-width="1.5"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>Nenhum agendamento encontrado</h3>
      <p>Crie um agendamento dentro de uma configuração existente.</p>
    </div>

    <div v-else class="schedulings-view__list">
      <router-link
        v-for="item in allSchedulings"
        :key="`${item.configId}-${item.scheduling.Id}`"
        :to="`/configurations/${item.configId}/schedulings/${item.scheduling.Id}`"
        class="scheduling-card"
      >
        <div class="scheduling-card__left">
          <div class="scheduling-card__title-row">
            <span class="scheduling-card__title">
              {{ item.scheduling.Parameters?.ThemeTitle || `Agendamento #${item.scheduling.Id}` }}
            </span>
          </div>
          <span v-if="item.scheduling.Parameters?.Description" class="scheduling-card__desc">
            {{ item.scheduling.Parameters.Description }}
          </span>
          <div class="scheduling-card__tags">
            <span class="scheduling-card__tag scheduling-card__tag--platform">
              <PlatformIcon :platform-id="item.platformId" />
              {{ platformLabel(item.platformId) }}
            </span>
            <span class="scheduling-card__tag scheduling-card__tag--config">
              {{ formatUrl(item.configUrl) }}
            </span>
            <span v-if="item.scheduling.Interval" class="scheduling-card__tag scheduling-card__tag--cron">
              {{ item.scheduling.Interval }}
            </span>
          </div>
        </div>
        <svg class="scheduling-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useConfigurations } from '@/composables/useConfigurations'
import PlatformIcon from '@/components/configuration/PlatformIcon.vue'

export default {
  name: 'SchedulingsView',
  components: { PlatformIcon },
  computed: {
    loading() {
      const { loading } = useConfigurations()
      return loading.value
    },
    configurations() {
      const { configurations } = useConfigurations()
      return configurations.value
    },
    allSchedulings() {
      const result = []
      for (const config of this.configurations) {
        for (const scheduling of (config.Schedulings || [])) {
          result.push({
            configId: config.Id,
            configUrl: config.Url,
            platformId: config.PlatformId,
            scheduling
          })
        }
      }
      return result
    }
  },
  methods: {
    platformLabel(platformId) {
      const map = { 1: 'WordPress', 2: 'Instagram' }
      return map[platformId] || 'Plataforma'
    },
    formatUrl(url) {
      if (!url) return 'Sem URL'
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  }
}
</script>

<style scoped>
.schedulings-view__header {
  margin-bottom: var(--spacing-xl);
}

.schedulings-view__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  text-decoration: none;
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-fast);
}

.schedulings-view__back:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.schedulings-view__title {
  font-size: var(--font-size-2xl);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-xs);
}

.schedulings-view__subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
}

.schedulings-view__loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

.schedulings-view__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

.schedulings-view__empty-icon {
  margin-bottom: var(--spacing-lg);
}

.schedulings-view__empty h3 {
  font-size: var(--font-size-lg);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-sm);
}

.schedulings-view__empty p {
  font-size: var(--font-size-sm);
}

/* Scheduling cards */
.schedulings-view__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.scheduling-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.scheduling-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  text-decoration: none;
}

.scheduling-card__left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scheduling-card__title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.scheduling-card__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-card__tags {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
  flex-wrap: wrap;
}

.scheduling-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
}

.scheduling-card__tag--platform {
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  font-weight: 600;
}

.scheduling-card__tag--config {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.scheduling-card__tag--cron {
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  font-family: monospace;
}

.scheduling-card__arrow {
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.scheduling-card:hover .scheduling-card__arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}
</style>
