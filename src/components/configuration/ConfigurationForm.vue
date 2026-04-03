<template>
  <form @submit.prevent="handleSubmit" class="config-form">
    <BaseInput
      v-model="form.PlatformName"
      label="Connection Name"
      placeholder="My website"
      :error="errors.PlatformName"
    />

    <BaseSelect
      v-model="form.PlatformId"
      label="Platform"
      :options="platformOptions"
      :error="errors.PlatformId"
    />

    <BaseInput
      v-model="form.Url"
      label="Website URL"
      placeholder="https://mysite.com"
      :error="errors.Url"
    />

    <BaseInput
      v-model="form.Username"
      label="Username"
      placeholder="Username"
      tooltip="This is not your WordPress admin login. Go to your WordPress admin panel → Users → Add New User, create a user with at least the 'Author' role, and enter that username here."
      :error="errors.Username"
    />

    <BaseInput
      v-model="form.Password"
      label="Password"
      type="password"
      placeholder="Access password"
      tooltip="Enter the password of the user you created in WordPress with the 'Author' role. This is not your admin panel password."
      :error="errors.Password"
    />

    <div class="config-form__actions">
      <BaseButton type="submit" :loading="loading">
        Save
      </BaseButton>
      <BaseButton variant="secondary" @click="$emit('cancel')">
        Cancel
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
  PlatformName: string
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
        PlatformName: '',
        PlatformId: String(this.platformId),
        Url: '',
        Username: '',
        Password: ''
      } as ConfigFormData,
      errors: {} as Record<string, string>,
      loading: false,
      platformOptions: [
        { value: '1', label: 'WordPress' }
      ] as SelectOption[]
    }
  },
  methods: {
    validate(): boolean {
      this.errors = {}
      if (!this.form.PlatformName) this.errors.PlatformName = 'Please enter the connection name'
      if (!this.form.Url) this.errors.Url = 'Please enter the URL'
      if (!this.form.Username) this.errors.Username = 'Please enter the username'
      if (!this.form.Password) this.errors.Password = 'Please enter the password'
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
        error(err.response?.data?.message || 'Failed to create connection')
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
