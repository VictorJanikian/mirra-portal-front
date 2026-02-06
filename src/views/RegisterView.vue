<template>
  <AuthCard>
    <h2 class="auth-title">Crie sua conta</h2>
    <p class="auth-subtitle">Comece a usar a Mirra AI agora</p>

    <form @submit.prevent="handleRegister" class="auth-form">
      <BaseInput
        v-model="name"
        label="Nome"
        placeholder="Seu nome"
        :error="errors.name"
      />

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
        placeholder="Mínimo 6 caracteres"
        :error="errors.password"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Registrar
      </BaseButton>
    </form>

    <p class="auth-link">
      Já tem conta? <router-link to="/login">Entrar</router-link>
    </p>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { isValidEmail, isValidPassword } from '@/utils/validators'

interface RegisterErrors {
  name: string
  email: string
  password: string
}

export default defineComponent({
  name: 'RegisterView',
  components: { AuthCard, BaseInput, BaseButton },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      loading: false,
      serverError: '',
      errors: { name: '', email: '', password: '' } as RegisterErrors
    }
  },
  methods: {
    validate(): boolean {
      this.errors = { name: '', email: '', password: '' }
      if (!this.name) this.errors.name = 'Informe seu nome'
      if (!this.email) this.errors.email = 'Informe seu e-mail'
      else if (!isValidEmail(this.email)) this.errors.email = 'E-mail inválido'
      if (!this.password) this.errors.password = 'Informe uma senha'
      else if (!isValidPassword(this.password)) this.errors.password = 'A senha deve ter no mínimo 6 caracteres'
      return !this.errors.name && !this.errors.email && !this.errors.password
    },
    async handleRegister(): Promise<void> {
      if (!this.validate()) return
      this.loading = true
      this.serverError = ''
      try {
        const { register } = useAuth()
        await register(this.name, this.email, this.password)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } | string } }
        this.serverError = (err.response?.data as { Message?: string })?.Message || err.response?.data as string || 'Erro ao criar conta. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  }
})
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
