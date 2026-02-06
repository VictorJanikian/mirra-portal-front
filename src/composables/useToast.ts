import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(msg: string): void { show(msg, 'success') }
  function error(msg: string): void { show(msg, 'error') }
  function info(msg: string): void { show(msg, 'info') }

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, success, error, info, dismiss }
}
