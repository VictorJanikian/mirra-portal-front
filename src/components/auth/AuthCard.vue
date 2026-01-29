<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__logo">
        <img :src="logo" alt="Mirra AI" class="auth-card__logo-img" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import logo from '@/assets/mirra-wordpress-logo.png'

export default {
  name: 'AuthCard',
  data() {
    return { logo }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  padding: var(--spacing-md);
}

.auth-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl);
  width: 100%;
  max-width: 440px;
  animation: fadeIn 0.3s ease;
}

.auth-card__logo {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.auth-card__logo-img {
  height: 80px;
  margin: 0 auto;
}
</style>
