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

    <div v-else class="home__stats">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ totalConfigs }}</span>
          <span class="stat-card__label">Configurações</span>
        </div>
      </div>

      <div class="stat-card">
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
      </div>

      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.5 17.82c-3.584-.698-6.32-3.874-6.32-7.66 0-.63.082-1.24.222-1.828L8.9 14.83v.99c0 1.1.9 2 2 2v1zm6.52-2.73c-.26-.8-1.01-1.39-1.9-1.39h-.6v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V6.7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ wordpressConfigs }}</span>
          <span class="stat-card__label">Sites WordPress</span>
        </div>
      </div>
    </div>

    <div v-if="!loading && totalConfigs === 0" class="home__empty">
      <div class="home__empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>Nenhuma configuração encontrada</h3>
      <p>Comece criando uma nova configuração na barra lateral.</p>
    </div>
  </div>
</template>

<script>
import { useConfigurations } from '@/composables/useConfigurations'

export default {
  name: 'HomeView',
  computed: {
    loading() {
      const { loading } = useConfigurations()
      return loading.value
    },
    totalConfigs() {
      const { configurations } = useConfigurations()
      return configurations.value.length
    },
    totalSchedulings() {
      const { configurations } = useConfigurations()
      return configurations.value.reduce((sum, c) => sum + (c.Schedulings || []).length, 0)
    },
    wordpressConfigs() {
      const { getByPlatform } = useConfigurations()
      return getByPlatform(0).length
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
  transition: box-shadow var(--transition-normal);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
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

.stat-card__icon--purple {
  background: #ede9fe;
  color: #7c3aed;
}

.stat-card__info {
  display: flex;
  flex-direction: column;
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
}
</style>
