<template>
  <AuthCard>
    <h2 class="auth-title">Ativar Conta</h2>
    <p class="auth-subtitle">
      Enviamos um código de 6 dígitos para <strong>{{ email }}</strong>.
    </p>

    <form @submit.prevent="handleActivate" class="auth-form">
      <div class="code-input-group">
        <label class="form-field__label">Código</label>
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

      <div v-if="serverError" class="auth-error">{{ serverError }}</div>

      <BaseButton type="submit" :loading="loading" block>
        Validar
      </BaseButton>
    </form>

    <p class="auth-link">
      <router-link to="/login">Voltar</router-link>
    </p>
  </AuthCard>
</template>

<script>
import AuthCard from '@/components/auth/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'ActivateView',
  components: { AuthCard, BaseButton },
  data() {
    return {
      code: '',
      loading: false,
      serverError: ''
    }
  },
  computed: {
    email() {
      return this.$route.query.email || ''
    }
  },
  methods: {
    onCodeInput(event, index) {
      const val = event.target.value.replace(/\D/g, '')
      event.target.value = val

      const arr = this.code.split('')
      arr[index] = val
      this.code = arr.join('')

      if (val && index < 5) {
        this.$refs.codeInputs[index + 1].focus()
      }
    },
    onCodeKeydown(event, index) {
      if (event.key === 'Backspace' && !this.code[index] && index > 0) {
        this.$refs.codeInputs[index - 1].focus()
      }
    },
    onCodePaste(event) {
      event.preventDefault()
      const pasted = (event.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
      this.code = pasted
      const inputs = this.$refs.codeInputs
      for (let i = 0; i < 6; i++) {
        inputs[i].value = pasted[i] || ''
      }
      if (pasted.length > 0) {
        const focusIdx = Math.min(pasted.length, 5)
        inputs[focusIdx].focus()
      }
    },
    async handleActivate() {
      if (this.code.length !== 6) {
        this.serverError = 'Digite o código completo de 6 dígitos'
        return
      }
      this.loading = true
      this.serverError = ''
      try {
        const { activate } = useAuth()
        await activate(this.email, this.code)
      } catch (e) {
        this.serverError = e.response?.data?.message || e.response?.data || 'Código inválido. Tente novamente.'
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
