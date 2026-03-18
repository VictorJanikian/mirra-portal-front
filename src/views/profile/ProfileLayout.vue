<template>
  <div class="profile-layout">
    <div class="profile-layout__header">
      <h1 class="profile-layout__title">Perfil</h1>
      <nav class="profile-layout__nav">
        <router-link
          to="/profile/data"
          class="profile-layout__tab"
          active-class="profile-layout__tab--active"
        >
          Meus dados
        </router-link>
        <router-link
          to="/profile/plan"
          class="profile-layout__tab"
          active-class="profile-layout__tab--active"
        >
          Meu plano
        </router-link>
        <router-link
          to="/profile/payments"
          class="profile-layout__tab"
          active-class="profile-layout__tab--active"
        >
          Pagamentos
        </router-link>
      </nav>
    </div>
    <div class="profile-layout__content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileLayout'
})
</script>

<style scoped>
.profile-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.profile-layout__header {
  margin-bottom: var(--spacing-xl);
}

.profile-layout__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-lg);
}

.profile-layout__nav {
  display: flex;
  gap: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.profile-layout__tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-500);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
  margin-bottom: -1px;
}

.profile-layout__tab:hover {
  color: var(--color-gray-700);
  text-decoration: none;
}

.profile-layout__tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.profile-layout__content {
  padding-top: var(--spacing-xl);
}
</style>
