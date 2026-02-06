<template>
  <div class="config-card" @click="$emit('select', configuration)">
    <div class="config-card__header">
      <PlatformIcon :platform-id="configuration.PlatformId" />
      <div class="config-card__info">
        <span class="config-card__platform">{{ platformLabel }}</span>
        <span class="config-card__url">{{ formatUrl(configuration.Url) }}</span>
      </div>
    </div>
    <div class="config-card__meta">
      <span class="config-card__user">{{ configuration.Username }}</span>
      <span class="config-card__badge">
        {{ schedulingCount }} agendamento{{ schedulingCount !== 1 ? 's' : '' }}
      </span>
    </div>
  </div>
</template>

<script>
import PlatformIcon from './PlatformIcon.vue'

export default {
  name: 'ConfigurationCard',
  components: { PlatformIcon },
  props: {
    configuration: { type: Object, required: true }
  },
  emits: ['select'],
  computed: {
    platformLabel() {
      const map = { 1: 'WordPress', 2: 'Instagram' }
      return map[this.configuration.PlatformId] || 'Plataforma'
    },
    schedulingCount() {
      return (this.configuration.Schedulings || []).length
    }
  },
  methods: {
    formatUrl(url) {
      if (!url) return ''
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  }
}
</script>

<style scoped>
.config-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.config-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.config-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.config-card__info {
  display: flex;
  flex-direction: column;
}

.config-card__platform {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.config-card__url {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
}

.config-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-card__user {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.config-card__badge {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  padding: 3px 10px;
  border-radius: 12px;
}
</style>
