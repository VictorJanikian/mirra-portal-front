<template>
  <div class="placeholder-view">
    <div class="placeholder-view__icon">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="8" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M32 4v8M32 52v8M4 32h8M52 32h8M11.5 11.5l5.7 5.7M46.8 46.8l5.7 5.7M52.5 11.5l-5.7 5.7M17.2 46.8l-5.7 5.7" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h2>Configurações</h2>
    <p>Esta funcionalidade estará disponível em breve.</p>
  </div>
</template>

<script>
export default {
  name: 'SettingsView'
}
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
}
</style>
