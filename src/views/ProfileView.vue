<template>
  <div class="placeholder-view">
    <div class="placeholder-view__icon">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="22" r="12" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h2>Perfil</h2>
    <p>Esta funcionalidade estará disponível em breve.</p>
    <div class="placeholder-view__info">
      <p><strong>Nome:</strong> {{ userName }}</p>
      <p><strong>E-mail:</strong> {{ userEmail }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default defineComponent({
  name: 'ProfileView',
  computed: {
    userName(): string {
      const { state } = useAuth()
      return state.user?.Name || ''
    },
    userEmail(): string {
      const { state } = useAuth()
      return state.user?.Email || ''
    }
  }
})
</script>

<style scoped>
.placeholder-view {
  text-align: center;
  padding: var(--spacing-3xl);
  max-width: 500px;
  margin: 0 auto;
}

.placeholder-view__icon {
  margin-bottom: var(--spacing-lg);
}

.placeholder-view h2 {
  font-size: var(--font-size-2xl);
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-sm);
}

.placeholder-view p {
  color: var(--color-gray-500);
  margin-bottom: var(--spacing-md);
}

.placeholder-view__info {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  text-align: left;
  margin-top: var(--spacing-xl);
}

.placeholder-view__info p {
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-sm);
}

.placeholder-view__info p:last-child {
  margin-bottom: 0;
}
</style>
