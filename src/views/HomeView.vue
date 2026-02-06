<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Dashboard</h1>
      <p class="home__subtitle">Bem-vindo ao Mirra AI. Gerencie seus agendamentos de conteúdo automatizado.</p>
    </div>

    <div v-if="loading" class="home__loading">
      <span class="spinner" style="border-color: rgba(37,99,235,0.2); border-top-color: #2563eb;" />
      <span>Carregando...</span>
    </div>

    <template v-else>
      <!-- Stat cards -->
      <div class="home__stats">
        <button
          class="stat-card stat-card--clickable"
          :class="{ 'stat-card--active': activeTab === 'configurations' }"
          @click="activeTab = 'configurations'"
        >
          <div class="stat-card__icon stat-card__icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalConfigs }}</span>
            <span class="stat-card__label">Configurações</span>
          </div>
        </button>

        <button
          class="stat-card stat-card--clickable"
          :class="{ 'stat-card--active': activeTab === 'schedulings' }"
          @click="activeTab = 'schedulings'"
        >
          <div class="stat-card__icon stat-card__icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalSchedulings }}</span>
            <span class="stat-card__label">Agendamentos Ativos</span>
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="totalConfigs === 0" class="home__empty">
        <div class="home__empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Nenhuma configuração encontrada</h3>
        <p>Comece conectando uma plataforma para criar agendamentos de conteúdo.</p>
        <button class="home__empty-btn" @click="openNewConfig(1)">
          + Nova Configuração WordPress
        </button>
      </div>

      <!-- Tab: Configurações -->
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'configurations' && totalConfigs > 0" key="configurations">
          <div class="home__section-header">
            <h2 class="home__section-title">Suas Configurações</h2>
            <button class="home__new-config-btn" @click="openNewConfig(1)">
              + Nova Configuração
            </button>
          </div>

          <div class="home__configs">
            <div
              v-for="config in configurations"
              :key="config.Id"
              class="config-item"
            >
              <button
                class="config-item__header"
                @click="toggleConfig(config.Id)"
              >
                <div class="config-item__platform">
                  <PlatformIcon :platform-id="config.PlatformId" />
                  <span class="config-item__platform-label">{{ platformLabel(config.PlatformId) }}</span>
                </div>
                <div class="config-item__details">
                  <span class="config-item__url">{{ formatUrl(config.Url) }}</span>
                  <span class="config-item__user">{{ config.Username }}</span>
                </div>
                <span class="config-item__badge">
                  {{ (config.Schedulings || []).length }} agendamento{{ (config.Schedulings || []).length !== 1 ? 's' : '' }}
                </span>
                <svg
                  class="config-item__expand"
                  :class="{ 'config-item__expand--open': isExpanded(config.Id) }"
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>

              <transition name="expand">
                <div v-if="isExpanded(config.Id)" class="config-item__body">
                  <div v-if="(config.Schedulings || []).length === 0" class="config-item__empty">
                    Nenhum agendamento nesta configuração.
                  </div>

                  <router-link
                    v-for="scheduling in (config.Schedulings || [])"
                    :key="scheduling.Id"
                    :to="`/configurations/${config.Id}/schedulings/${scheduling.Id}`"
                    class="scheduling-row"
                  >
                    <div class="scheduling-row__info">
                      <span class="scheduling-row__title">
                        {{ scheduling.Parameters?.ThemeTitle || `Agendamento #${scheduling.Id}` }}
                      </span>
                      <span v-if="scheduling.Parameters?.Description" class="scheduling-row__desc">
                        {{ scheduling.Parameters.Description }}
                      </span>
                    </div>
                    <div class="scheduling-row__meta">
                      <span v-if="scheduling.Interval" class="scheduling-row__interval">
                        {{ scheduling.Interval }}
                      </span>
                      <svg class="scheduling-row__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </div>
                  </router-link>

                  <router-link
                    :to="`/configurations/${config.Id}/schedulings/new`"
                    class="config-item__add-scheduling"
                  >
                    + Novo Agendamento
                  </router-link>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Tab: Agendamentos -->
        <div v-else-if="activeTab === 'schedulings' && totalConfigs > 0" key="schedulings">
          <div class="home__section-header">
            <h2 class="home__section-title">Todos os Agendamentos</h2>
          </div>

          <div v-if="allSchedulings.length === 0" class="home__empty-tab">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#cbd5e1" stroke-width="1.5"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>Nenhum agendamento encontrado.</p>
            <span>Crie um agendamento dentro de uma configuração.</span>
          </div>

          <div v-else class="home__schedulings-list">
            <router-link
              v-for="item in allSchedulings"
              :key="`${item.configId}-${item.scheduling.Id}`"
              :to="`/configurations/${item.configId}/schedulings/${item.scheduling.Id}`"
              class="scheduling-card"
            >
              <div class="scheduling-card__left">
                <span class="scheduling-card__title">
                  {{ item.scheduling.Parameters?.ThemeTitle || `Agendamento #${item.scheduling.Id}` }}
                </span>
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
      </transition>
    </template>
  </div>
</template>

<script>
import { useConfigurations } from '@/composables/useConfigurations'
import PlatformIcon from '@/components/configuration/PlatformIcon.vue'

export default {
  name: 'HomeView',
  components: { PlatformIcon },
  inject: {
    openNewConfigurationModal: { default: () => () => {} }
  },
  data() {
    return {
      activeTab: 'configurations',
      expandedConfigs: []
    }
  },
  computed: {
    loading() {
      const { loading } = useConfigurations()
      return loading.value
    },
    configurations() {
      const { configurations } = useConfigurations()
      return configurations.value
    },
    totalConfigs() {
      return this.configurations.length
    },
    totalSchedulings() {
      return this.configurations.reduce((sum, c) => sum + (c.Schedulings || []).length, 0)
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
    },
    isExpanded(id) {
      return this.expandedConfigs.includes(id)
    },
    toggleConfig(id) {
      const idx = this.expandedConfigs.indexOf(id)
      if (idx >= 0) {
        this.expandedConfigs.splice(idx, 1)
      } else {
        this.expandedConfigs.push(id)
      }
    },
    openNewConfig(platformId) {
      this.openNewConfigurationModal(platformId)
    }
  }
}
</script>

<style scoped>
.home__header {
  margin-bottom: var(--spacing-xl);
}

.home__title {
  font-size: var(--font-size-2xl);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-xs);
}

.home__subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
}

.home__loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

/* Stat Cards */
.home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: all var(--transition-normal);
  text-align: left;
  width: 100%;
}

.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.stat-card--active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.stat-card--active .stat-card__label {
  color: var(--color-primary);
  font-weight: 600;
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__icon--blue {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.stat-card__icon--green {
  background: var(--color-success-light);
  color: var(--color-success);
}

.stat-card__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-card__value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

/* Empty tab state */
.home__empty-tab {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  color: var(--color-gray-400);
}

.home__empty-tab p {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.home__empty-tab span {
  font-size: var(--font-size-sm);
}

/* Empty state */
.home__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

.home__empty-icon {
  margin-bottom: var(--spacing-lg);
}

.home__empty h3 {
  font-size: var(--font-size-lg);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-sm);
}

.home__empty p {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xl);
}

.home__empty-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.home__empty-btn:hover {
  background: var(--color-primary-dark);
}

/* Section header */
.home__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.home__section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
}

.home__new-config-btn {
  padding: 8px 16px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.home__new-config-btn:hover {
  background: var(--color-primary-dark);
}

/* Configuration items */
.home__configs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-item {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-normal);
}

.config-item:hover {
  border-color: var(--color-gray-300);
}

.config-item__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.config-item__header:hover {
  background: var(--color-gray-50);
}

.config-item__platform {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.config-item__platform-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.config-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.config-item__url {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-item__user {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.config-item__badge {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.config-item__expand {
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-normal);
}

.config-item__expand--open {
  transform: rotate(180deg);
}

/* Expanded body */
.config-item__body {
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-lg);
}

.config-item__empty {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

/* Scheduling rows */
.scheduling-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background var(--transition-fast);
  cursor: pointer;
}

.scheduling-row:hover {
  background: var(--color-gray-50);
  text-decoration: none;
}

.scheduling-row__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.scheduling-row__title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-row__desc {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.scheduling-row__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.scheduling-row__interval {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  font-family: monospace;
  background: var(--color-gray-100);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
}

.scheduling-row__arrow {
  color: var(--color-gray-400);
}

.scheduling-row:hover .scheduling-row__arrow {
  color: var(--color-primary);
}

.config-item__add-scheduling {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background var(--transition-fast);
  margin-top: var(--spacing-xs);
}

.config-item__add-scheduling:hover {
  background: var(--color-primary-light);
  text-decoration: none;
}

/* Scheduling cards (tab agendamentos) */
.home__schedulings-list {
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

/* Fade transition (tab switch) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Expand transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
