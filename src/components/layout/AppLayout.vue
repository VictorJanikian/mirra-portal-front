<template>
  <div class="app-layout">
    <div
      v-if="sidebarOpen"
      class="app-layout__overlay"
      @click="sidebarOpen = false"
    />

    <AppSidebar
      :mobile-open="sidebarOpen"
      @new-configuration="handleNewConfiguration"
    />

    <div class="app-layout__main">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="app-layout__content">
        <router-view />
      </main>
    </div>

    <!-- Modal: New Connection -->
    <BaseModal
      :show="showConfigModal"
      title="New Connection"
      @close="showConfigModal = false"
    >
      <ConfigurationForm
        :platform-id="newConfigPlatformId"
        @saved="onConfigSaved"
        @cancel="showConfigModal = false"
      />
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfigurationForm from '@/components/configuration/ConfigurationForm.vue'
import { useConfigurations } from '@/composables/useConfigurations'
import { useSubscription } from '@/composables/useSubscription'
import { useToast } from '@/composables/useToast'

export default defineComponent({
  name: 'AppLayout',
  components: { AppSidebar, AppHeader, BaseModal, ConfigurationForm },
  provide() {
    return {
      openNewConfigurationModal: this.handleNewConfiguration
    }
  },
  data() {
    return {
      sidebarOpen: false,
      showConfigModal: false,
      newConfigPlatformId: 0
    }
  },
  methods: {
    handleNewConfiguration(platformId: number): void {
      this.newConfigPlatformId = platformId
      this.showConfigModal = true
    },
    async onConfigSaved(): Promise<void> {
      this.showConfigModal = false
      const { fetchAll } = useConfigurations()
      const { fetchRemainingConfigurations } = useSubscription()
      await Promise.all([fetchAll(), fetchRemainingConfigurations()])
      const { success } = useToast()
      success('Connection created successfully!')
    }
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout__overlay {
  display: none;
}

.app-layout__main {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout__content {
  flex: 1;
  padding: var(--spacing-xl);
  background: var(--color-gray-50);
}

@media (max-width: 992px) {
  .app-layout__main {
    margin-left: 0;
  }

  .app-layout__overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }
}
</style>
