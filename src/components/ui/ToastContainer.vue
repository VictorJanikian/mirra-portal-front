<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`]"
        @click="dismiss(toast.id)"
      >
        <span class="toast__icon">
          <template v-if="toast.type === 'success'">&#10003;</template>
          <template v-else-if="toast.type === 'error'">&#10007;</template>
          <template v-else>&#9432;</template>
        </span>
        <span class="toast__message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToast } from '@/composables/useToast'

export default {
  name: 'ToastContainer',
  setup() {
    const { toasts, dismiss } = useToast()
    return { toasts, dismiss }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  animation: fadeIn 0.25s ease;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.toast--success {
  background: var(--color-success-light);
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.toast--error {
  background: var(--color-danger-light);
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast--info {
  background: var(--color-info-light);
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.toast__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.toast__message {
  flex: 1;
}

.toast-enter-active {
  animation: fadeIn 0.25s ease;
}

.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
