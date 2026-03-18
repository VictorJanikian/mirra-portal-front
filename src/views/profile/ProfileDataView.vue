<template>
  <div class="profile-data">
    <div class="card">
      <h2 class="profile-data__title">Meus dados</h2>
      <div class="profile-data__fields">
        <div class="profile-data__field">
          <span class="profile-data__label">Nome</span>
          <span class="profile-data__value">{{ userName }}</span>
        </div>
        <div class="profile-data__field">
          <span class="profile-data__label">E-mail</span>
          <span class="profile-data__value">{{ userEmail }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default defineComponent({
  name: 'ProfileDataView',
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
.profile-data__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-lg);
}

.profile-data__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.profile-data__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.profile-data__label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-500);
}

.profile-data__value {
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
}
</style>
