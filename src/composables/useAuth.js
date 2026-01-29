import { reactive, computed } from 'vue'
import authService from '@/services/authService'
import router from '@/router'

const state = reactive({
  user: JSON.parse(localStorage.getItem('mirra_user') || 'null'),
  token: localStorage.getItem('mirra_token') || null
})

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token)

  function setSession(data) {
    state.user = { Id: data.Id, Name: data.Name, Email: data.Email }
    state.token = data.Token.Value
    localStorage.setItem('mirra_token', data.Token.Value)
    localStorage.setItem('mirra_user', JSON.stringify(state.user))
  }

  async function login(email, password) {
    const { data } = await authService.login(email, password)
    setSession(data)
    router.push({ name: 'Home' })
  }

  async function register(name, email, password) {
    await authService.register(name, email, password)
    router.push({ name: 'Activate', query: { email } })
  }

  async function activate(email, code) {
    const { data } = await authService.activate(email, code)
    setSession(data)
    router.push({ name: 'Home' })
  }

  function logout() {
    state.user = null
    state.token = null
    localStorage.removeItem('mirra_token')
    localStorage.removeItem('mirra_user')
    router.push({ name: 'Login' })
  }

  return { state, isAuthenticated, login, register, activate, logout }
}
