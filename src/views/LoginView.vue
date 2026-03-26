<template>
  <AuthCard>
    <h2 class="auth-title">Welcome back</h2>
    <p class="auth-subtitle">Sign in to your account to continue</p>

    <form @submit.prevent="handleLogin" class="auth-form">
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@email.com"
        :error="errors.email"
      />

      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Your password"
        :error="errors.password"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Sign In
      </BaseButton>
    </form>

    <p class="auth-link">
      Don't have an account? <router-link to="/register">Sign Up</router-link>
    </p>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { isValidEmail } from '@/utils/validators'

interface LoginErrors {
  email: string
  password: string
}

export default defineComponent({
  name: 'LoginView',
  components: { AuthCard, BaseInput, BaseButton },
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      serverError: '',
      errors: { email: '', password: '' } as LoginErrors
    }
  },
  methods: {
    validate(): boolean {
      this.errors = { email: '', password: '' }
      if (!this.email) this.errors.email = 'Please enter your email'
      else if (!isValidEmail(this.email)) this.errors.email = 'Invalid email'
      if (!this.password) this.errors.password = 'Please enter your password'
      return !this.errors.email && !this.errors.password
    },
    async handleLogin(): Promise<void> {
      if (!this.validate()) return
      this.loading = true
      this.serverError = ''
      try {
        const { login } = useAuth()
        await login(this.email, this.password)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } | string } }
        this.serverError = (err.response?.data as { message?: string })?.message || err.response?.data as string || 'Login failed. Please check your credentials.'
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
