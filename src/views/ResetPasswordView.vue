<template>
  <AuthCard>
    <h2 class="auth-title">Reset password</h2>
    <p class="auth-subtitle">
      We sent a 6-digit code to <strong>{{ email }}</strong>. Enter it below along with your new password.
    </p>

    <form @submit.prevent="handleResetPassword" class="auth-form">
      <div class="code-input-group">
        <label class="form-field__label">Code</label>
        <div class="code-inputs">
          <input
            v-for="(_, i) in 6"
            :key="i"
            ref="codeInputs"
            type="text"
            maxlength="1"
            class="code-input"
            :value="code[i] || ''"
            @input="onCodeInput($event, i)"
            @keydown="onCodeKeydown($event, i)"
            @paste="onCodePaste"
            inputmode="numeric"
          />
        </div>
      </div>

      <BaseInput
        v-model="newPassword"
        label="New password"
        type="password"
        placeholder="Your new password"
        :error="errors.newPassword"
      />

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Reset password
      </BaseButton>
    </form>

    <p class="auth-link">
      <router-link :to="{ path: '/login', query: $route.query.redirect ? { redirect: $route.query.redirect } : {} }">Go back</router-link>
    </p>
  </AuthCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

interface ResetPasswordErrors {
  newPassword: string
}

export default defineComponent({
  name: 'ResetPasswordView',
  components: { AuthCard, BaseInput, BaseButton },
  data() {
    return {
      code: '',
      newPassword: '',
      loading: false,
      serverError: '',
      errors: { newPassword: '' } as ResetPasswordErrors
    }
  },
  computed: {
    email(): string {
      return (this.$route.query.email as string) || ''
    }
  },
  methods: {
    onCodeInput(event: Event, index: number): void {
      const target = event.target as HTMLInputElement
      const val = target.value.replace(/\D/g, '')
      target.value = val

      const arr = this.code.split('')
      arr[index] = val
      this.code = arr.join('')

      if (val && index < 5) {
        const inputs = this.$refs.codeInputs as HTMLInputElement[]
        inputs[index + 1].focus()
      }
    },
    onCodeKeydown(event: KeyboardEvent, index: number): void {
      if (event.key === 'Backspace' && !this.code[index] && index > 0) {
        const inputs = this.$refs.codeInputs as HTMLInputElement[]
        inputs[index - 1].focus()
      }
    },
    onCodePaste(event: ClipboardEvent): void {
      event.preventDefault()
      const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
      this.code = pasted
      const inputs = this.$refs.codeInputs as HTMLInputElement[]
      for (let i = 0; i < 6; i++) {
        inputs[i].value = pasted[i] || ''
      }
      if (pasted.length > 0) {
        const focusIdx = Math.min(pasted.length, 5)
        inputs[focusIdx].focus()
      }
    },
    validate(): boolean {
      this.errors = { newPassword: '' }
      if (this.code.length !== 6) {
        this.serverError = 'Please enter the complete 6-digit code'
        return false
      }
      if (!this.newPassword) {
        this.errors.newPassword = 'Please enter your new password'
        return false
      }
      return true
    },
    async handleResetPassword(): Promise<void> {
      this.serverError = ''
      if (!this.validate()) return
      this.loading = true
      try {
        const { resetPassword } = useAuth()
        await resetPassword(this.email, this.code, this.newPassword)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string; message?: string } | string } }
        const data = err.response?.data
        if (typeof data === 'string') {
          this.serverError = data
        } else {
          this.serverError = data?.Message || data?.message || 'Unable to reset your password. Please try again.'
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
  gap: var(--spacing-lg);
}

.code-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.code-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 1px solid var(--border-input);
  border-radius: var(--border-radius);
  background: var(--color-white);
  color: var(--color-gray-900);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.code-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
  outline: none;
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
