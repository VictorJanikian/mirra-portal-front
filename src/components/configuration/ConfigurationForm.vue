<template>
  <form @submit.prevent="handleSubmit" class="config-form">
    <BaseSelect
      v-model="form.PlatformId"
      label="Platform"
      :options="platformOptions"
      :error="errors.PlatformId"
    />

    <!-- Instagram: connected through the official authorization flow -->
    <template v-if="isInstagram">
      <div class="config-form__connect">
        <PlatformIcon :platform-id="PLATFORM_INSTAGRAM" class="config-form__connect-icon" />
        <p class="config-form__connect-text">
          You will be redirected to Instagram to authorize Mirra AI.
          After confirming, your profile is connected automatically.
        </p>
      </div>

      <div class="config-form__actions">
        <BaseButton :loading="loading" @click="handleInstagramConnect">
          Connect Instagram
        </BaseButton>
        <BaseButton variant="secondary" @click="$emit('cancel')">
          Cancel
        </BaseButton>
      </div>
    </template>

    <!-- WordPress: manual credentials -->
    <template v-else>
      <BaseInput
        v-model="form.PlatformName"
        label="Connection Name"
        placeholder="My website"
        :error="errors.PlatformName"
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
        tooltip="Create an application password for the user with the Author role (Users -> User -> Add Application Password). This is not the user password."
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
    </template>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlatformIcon from '@/components/configuration/PlatformIcon.vue'
import { useConfigurations } from '@/composables/useConfigurations'
import { useToast } from '@/composables/useToast'
import { PLATFORM_WORDPRESS, PLATFORM_INSTAGRAM } from '@/types'
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
  components: { BaseInput, BaseSelect, BaseButton, PlatformIcon },
  props: {
    platformId: { type: Number, default: 0 }
  },
  emits: ['saved', 'cancel'],
  data() {
    return {
      PLATFORM_INSTAGRAM,
      form: {
        PlatformName: '',
        PlatformId: String(this.platformId || PLATFORM_WORDPRESS),
        Url: '',
        Username: '',
        Password: ''
      } as ConfigFormData,
      errors: {} as Record<string, string>,
      loading: false,
      platformOptions: [
        { value: String(PLATFORM_WORDPRESS), label: 'WordPress' },
        { value: String(PLATFORM_INSTAGRAM), label: 'Instagram' }
      ] as SelectOption[]
    }
  },
  computed: {
    isInstagram(): boolean {
      return Number(this.form.PlatformId) === PLATFORM_INSTAGRAM
    }
  },
  watch: {
    platformId(value: number): void {
      this.form.PlatformId = String(value || PLATFORM_WORDPRESS)
      this.errors = {}
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
      if (this.isInstagram) {
        await this.handleInstagramConnect()
        return
      }
      if (!this.validate()) return
      this.loading = true
      try {
        const { create } = useConfigurations()
        await create({
          ...this.form,
          PlatformId: Number(this.form.PlatformId),
          Schedulings: []
        })
        this.$emit('saved')
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } } }
        const { error } = useToast()
        error(err.response?.data?.Message || 'Failed to create connection')
      } finally {
        this.loading = false
      }
    },
    async handleInstagramConnect(): Promise<void> {
      this.loading = true
      try {
        const { startInstagramConnection } = useConfigurations()
        await startInstagramConnection()
        // The browser is now heading to Instagram, so the loading state is kept
        // on purpose until the page unloads.
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } }; message?: string }
        const { error } = useToast()
        error(err.response?.data?.Message || err.message || 'Failed to start the Instagram connection')
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

.config-form__connect {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-gray-50);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.config-form__connect-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.config-form__connect-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.5;
}
</style>
