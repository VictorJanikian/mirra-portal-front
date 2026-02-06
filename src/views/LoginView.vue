<template>
  <AuthCard>
    <h2 class="auth-title">Bem-vindo de volta</h2>
    <p class="auth-subtitle">Entre na sua conta para continuar</p>

    <form @submit.prevent="handleLogin" class="auth-form">
      <BaseInput
        v-model="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        :error="errors.email"
      />

      <BaseInput
        v-model="password"
        label="Senha"
        type="password"
        placeholder="Sua senha"
        :error="errors.password"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Entrar
      </BaseButton>
    </form>

    <p class="auth-link">
      Não tem conta? <router-link to="/register">Cadastre-se</router-link>
    </p>
  </AuthCard>
</template>

<script>
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { isValidEmail } from '@/utils/validators'

export default {
  name: 'LoginView',
  components: { AuthCard, BaseInput, BaseButton },
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      serverError: '',
      errors: { email: '', password: '' }
    }
  },
  methods: {
    validate() {
      this.errors = { email: '', password: '' }
      if (!this.email) this.errors.email = 'Informe seu e-mail'
      else if (!isValidEmail(this.email)) this.errors.email = 'E-mail inválido'
      if (!this.password) this.errors.password = 'Informe sua senha'
      return !this.errors.email && !this.errors.password
    },
    async handleLogin() {
      if (!this.validate()) return
      this.loading = true
      this.serverError = ''
      try {
        const { login } = useAuth()
        await login(this.email, this.password)
      } catch (e) {
        this.serverError = e.response?.data?.message || e.response?.data || 'Erro ao fazer login. Verifique suas credenciais.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-xs);
}

.auth-subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xl);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-error {
  padding: 10px 14px;
  background: var(--color-danger-light);
  color: #991b1b;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  border: 1px solid #fecaca;
}

.auth-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.auth-link a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-link a:hover {
  color: var(--color-primary-hover);
}
</style>
