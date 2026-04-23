<template>
  <AuthCard>
    <h2 class="auth-title">Create your account</h2>
    <p class="auth-subtitle">Start using Mirra AI now</p>

    <form @submit.prevent="handleRegister" class="auth-form">
      <BaseInput
        v-model="name"
        label="Name"
        placeholder="Your name"
        :error="errors.name"
      />

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
        placeholder="Minimum 6 characters"
        :error="errors.password"
      />

      <BaseSelect
        v-model="country"
        label="Country"
        :options="countryOptions"
        placeholder="Select your country"
        :error="errors.country"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block class="btn--form">
        Sign Up
      </BaseButton>
    </form>

    <p class="auth-link">
      Already have an account? <router-link :to="{ path: '/login', query: $route.query }">Sign In</router-link>
    </p>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { COUNTRIES } from '@/constants/countries'
import type { SelectOption } from '@/types'

interface RegisterErrors {
  name: string
  email: string
  password: string
  country: string
}

export default defineComponent({
  name: 'RegisterView',
  components: { AuthCard, BaseInput, BaseSelect, BaseButton },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      country: '',
      loading: false,
      serverError: '',
      errors: { name: '', email: '', password: '', country: '' } as RegisterErrors
    }
  },
  computed: {
    countryOptions(): SelectOption[] {
      return COUNTRIES
    }
  },
  methods: {
    validate(): boolean {
      this.errors = { name: '', email: '', password: '', country: '' }
      if (!this.name) this.errors.name = 'Please enter your name'
      if (!this.email) this.errors.email = 'Please enter your email'
      else if (!isValidEmail(this.email)) this.errors.email = 'Invalid email'
      if (!this.password) this.errors.password = 'Please enter a password'
      else if (!isValidPassword(this.password)) this.errors.password = 'Password must be at least 6 characters'
      if (!this.country) this.errors.country = 'Please select your country'
      return !this.errors.name && !this.errors.email && !this.errors.password && !this.errors.country
    },
    async handleRegister(): Promise<void> {
      if (!this.validate()) return
      this.loading = true
      this.serverError = ''
      try {
        const { register } = useAuth()
        await register(this.name, this.email, this.password, this.country)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } | string } }
        this.serverError = (err.response?.data as { Message?: string })?.Message || err.response?.data as string || 'Failed to create account. Please try again.'
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
