<template>
  <form @submit.prevent="handleSubmit" class="config-form">
    <BaseSelect
      v-model="form.PlatformId"
      label="Plataforma"
      :options="platformOptions"
      :error="errors.PlatformId"
    />

    <BaseInput
      v-model="form.Url"
      label="URL do site"
      placeholder="https://meusite.com.br"
      :error="errors.Url"
    />

    <BaseInput
      v-model="form.Username"
      label="Usuário"
      placeholder="Nome de usuário"
      :error="errors.Username"
    />

    <BaseInput
      v-model="form.Password"
      label="Senha"
      type="password"
      placeholder="Senha de acesso"
      :error="errors.Password"
    />

    <div class="config-form__actions">
      <BaseButton type="submit" :loading="loading">
        Salvar
      </BaseButton>
      <BaseButton variant="secondary" @click="$emit('cancel')">
        Cancelar
      </BaseButton>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useConfigurations } from '@/composables/useConfigurations'
import { useToast } from '@/composables/useToast'
import type { SelectOption } from '@/types'

interface ConfigFormData {
  PlatformId: string
  Url: string
  Username: string
  Password: string
}

export default defineComponent({
  name: 'ConfigurationForm',
  components: { BaseInput, BaseSelect, BaseButton },
  props: {
    platformId: { type: Number, default: 0 }
  },
  emits: ['saved', 'cancel'],
  data() {
    return {
      form: {
        PlatformId: String(this.platformId),
        Url: '',
        Username: '',
        Password: ''
      } as ConfigFormData,
      errors: {} as Record<string, string>,
      loading: false,
      platformOptions: [
        { value: '1', label: 'WordPress' },
        { value: '2', label: 'Instagram' }
      ] as SelectOption[]
    }
  },
  methods: {
    validate(): boolean {
      this.errors = {}
      if (!this.form.Url) this.errors.Url = 'Informe a URL'
      if (!this.form.Username) this.errors.Username = 'Informe o usuário'
      if (!this.form.Password) this.errors.Password = 'Informe a senha'
      return Object.keys(this.errors).length === 0
    },
    async handleSubmit(): Promise<void> {
      if (!this.validate()) return
      this.loading = true
      try {
        const { create } = useConfigurations()
        await create({
          ...this.form,
          PlatformId: Number(this.form.PlatformId)
        })
        this.$emit('saved')
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        const { error } = useToast()
        error(err.response?.data?.message || 'Erro ao criar conexão')
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style scoped>
.config-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-form__actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
</style>
