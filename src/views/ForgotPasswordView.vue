<template>
  <AuthCard>
    <h2 class="auth-title">Forgot password</h2>
    <p class="auth-subtitle">Enter your email and we'll send you a code to reset your password.</p>

    <form @submit.prevent="handleForgotPassword" class="auth-form">
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@email.com"
        :error="errors.email"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Send code
      </BaseButton>
    </form>

    <p class="auth-link">
      <router-link :to="{ path: '/login', query: $route.query }">Go back</router-link>
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

interface ForgotPasswordErrors {
  email: string
}

export default defineComponent({
  name: 'ForgotPasswordView',
  components: { AuthCard, BaseInput, BaseButton },
  data() {
    return {
      email: '',
      loading: false,
      serverError: '',
      errors: { email: '' } as ForgotPasswordErrors
    }
  },
  methods: {
    validate(): boolean {
      this.errors = { email: '' }
      if (!this.email) this.errors.email = 'Please enter your email'
      else if (!isValidEmail(this.email)) this.errors.email = 'Invalid email'
      return !this.errors.email
    },
    async handleForgotPassword(): Promise<void> {
      if (!this.validate()) return
      this.loading = true
      this.serverError = ''
      try {
        const { forgotPassword } = useAuth()
        await forgotPassword(this.email)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string; message?: string } | string } }
        const data = err.response?.data
        if (typeof data === 'string') {
          this.serverError = data
        } else {
          this.serverError = data?.Message || data?.message || 'Unable to send the reset code. Please try again.'
        }
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
  line-height: 1.5;
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
