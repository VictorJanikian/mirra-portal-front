<template>
  <span class="platform-icon" :class="`platform-icon--${platformName}`">
    <!-- WordPress -->
    <svg v-if="platformId === 0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.5 17.82c-3.584-.698-6.32-3.874-6.32-7.66 0-.63.082-1.24.222-1.828L8.9 14.83v.99c0 1.1.9 2 2 2v1zm6.52-2.73c-.26-.8-1.01-1.39-1.9-1.39h-.6v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V6.7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
    <!-- Instagram -->
    <svg v-else-if="platformId === 1" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'PlatformIcon',
  props: {
    platformId: { type: Number, required: true }
  },
  computed: {
    platformName() {
      const map = { 0: 'wordpress', 1: 'instagram' }
      return map[this.platformId] || 'unknown'
    }
  }
}
</script>

<style scoped>
.platform-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.platform-icon--wordpress {
  color: #21759b;
}

.platform-icon--instagram {
  color: #e4405f;
}
</style>
