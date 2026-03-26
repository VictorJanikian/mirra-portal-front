import { reactive, computed } from 'vue'
import authService from '@/services/authService'
import router from '@/router'
import type { AuthResponse, User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
}

const state = reactive<AuthState>({
  user: JSON.parse(localStorage.getItem('mirra_user') || 'null'),
  token: localStorage.getItem('mirra_token') || null
})

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token)

  function setSession(data: AuthResponse): void {
    state.user = { Id: data.Id, Name: data.Name, Email: data.Email }
    state.token = data.Token.Value
    localStorage.setItem('mirra_token', data.Token.Value)
    localStorage.setItem('mirra_user', JSON.stringify(state.user))
  }

  async function login(email: string, password: string): Promise<void> {
    const { data } = await authService.login(email, password)
    setSession(data)
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    router.push(redirect || { name: 'Home' })
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await authService.register(name, email, password)
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    const query: Record<string, string> = { email }
    if (redirect) query.redirect = redirect
    router.push({ name: 'Activate', query })
  }

  async function activate(email: string, code: string): Promise<void> {
    const { data } = await authService.activate(email, code)
    setSession(data)
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    router.push(redirect || { name: 'Home' })
  }

  function logout(): void {
    state.user = null
    state.token = null
    localStorage.removeItem('mirra_token')
    localStorage.removeItem('mirra_user')
    router.push({ name: 'Login' })
  }

  return { state, isAuthenticated, login, register, activate, logout }
}
