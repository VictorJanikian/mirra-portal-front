<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Dashboard</h1>
      <p class="home__subtitle">Welcome to Mirra AI. Manage your automated content schedules.</p>
    </div>

    <div v-if="hasSuspendedNopayment" class="home__banner home__banner--warning">
      You have schedules suspended due to payment issues.
      <a :href="stripePortalUrl" target="_blank" rel="noopener" class="home__banner-link">Resolve your payment</a>
      or limit the number of weekly posts for the affected connections.
    </div>

    <div v-if="hasSuspendedDowngrade" class="home__banner home__banner--warning">
      You have schedules suspended due to a plan downgrade.
      <router-link :to="{ name: 'ProfilePlan' }" class="home__banner-link">Upgrade your plan</router-link>
      or reduce the number of weekly posts for the affected connections.
    </div>

    <div v-if="loading" class="home__loading">
      <span class="spinner" style="border-color: rgba(37,99,235,0.2); border-top-color: #2563eb;" />
      <span>Loading...</span>
    </div>

    <template v-else>
      <!-- Stat cards -->
      <div class="home__stats">
        <button
          class="stat-card stat-card--clickable"
          :class="{ 'stat-card--active': activeTab === 'configurations' }"
          @click="activeTab = 'configurations'"
        >
          <div class="stat-card__icon stat-card__icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalConfigs }}</span>
            <span class="stat-card__label">Connections</span>
          </div>
        </button>

        <button
          class="stat-card stat-card--clickable"
          :class="{ 'stat-card--active': activeTab === 'schedulings' }"
          @click="activeTab = 'schedulings'"
        >
          <div class="stat-card__icon stat-card__icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalSchedulings }}</span>
            <span class="stat-card__label">Active Schedules</span>
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="totalConfigs === 0" class="home__empty">
        <div class="home__empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>No connections found</h3>
        <p>Start by connecting a platform to create content schedules.</p>
        <div class="home__btn-wrapper">
          <button
            class="home__empty-btn"
            :class="{ 'home__empty-btn--disabled': !canCreateConfig }"
            :disabled="!canCreateConfig"
            @click="canCreateConfig && openNewConfig(1)"
          >
            <SvgIcon v-if="!canCreateConfig" name="lock" :size="12" class="home__lock-icon" />
            Connect site or profile
          </button>
          <div v-if="!canCreateConfig" class="home__limit-tooltip">
            You have reached the maximum number of connections available on your plan.
            <router-link :to="{ name: 'ProfilePlan' }" class="home__limit-tooltip-link">Click here</router-link>
            to upgrade your plan.
          </div>
        </div>
      </div>

      <!-- Tab: Connections -->
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'configurations' && totalConfigs > 0" key="configurations">
          <div class="home__section-header">
            <h2 class="home__section-title">Your Connections</h2>
            <div class="home__btn-wrapper">
              <button
                class="home__new-config-btn"
                :class="{ 'home__new-config-btn--disabled': !canCreateConfig }"
                :disabled="!canCreateConfig"
                @click="canCreateConfig && openNewConfig(1)"
              >
                <SvgIcon v-if="!canCreateConfig" name="lock" :size="12" class="home__lock-icon" />
                {{ canCreateConfig ? '+ New Connection' : 'New Connection' }}
              </button>
              <div v-if="!canCreateConfig" class="home__limit-tooltip">
                You have reached the maximum number of connections available on your plan.
                <router-link :to="{ name: 'ProfilePlan' }" class="home__limit-tooltip-link">Click here</router-link>
                to upgrade your plan.
              </div>
            </div>
          </div>

          <div class="home__configs">
            <div
              v-for="config in configurations"
              :key="config.Id"
              class="config-item"
            >
              <button
                class="config-item__header"
                @click="toggleConfig(config.Id)"
              >
                <div class="config-item__platform">
                  <PlatformIcon :platform-id="config.PlatformId" />
                  <span class="config-item__platform-label">{{ platformLabel(config.PlatformId) }}</span>
                </div>
                <div class="config-item__details">
                  <span class="config-item__url">{{ formatName(config.PlatformName) }}</span>
                  <span class="config-item__user">{{ config.Username }}</span>
                </div>
                <span class="config-item__badge">
                  {{ (config.Schedulings || []).length }} schedule{{ (config.Schedulings || []).length !== 1 ? 's' : '' }}
                </span>
                <div class="config-item__actions" @click.stop>
                  <button class="config-item__action-btn" title="Edit connection" @click="openEditConfig(config)">
                    <SvgIcon name="edit" :size="15" />
                  </button>
                  <button class="config-item__action-btn config-item__action-btn--danger" title="Delete connection" @click="openDeleteConfig(config)">
                    <SvgIcon name="trash" :size="15" />
                  </button>
                </div>
                <svg
                  class="config-item__expand"
                  :class="{ 'config-item__expand--open': isExpanded(config.Id) }"
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>

              <transition name="expand">
                <div v-if="isExpanded(config.Id)" class="config-item__body">
                  <div v-if="(config.Schedulings || []).length === 0" class="config-item__empty">
                    No schedules in this connection.
                  </div>

                  <router-link
                    v-for="scheduling in (config.Schedulings || [])"
                    :key="scheduling.Id"
                    :to="`/configurations/${config.Id}/schedulings/${scheduling.Id}`"
                    class="scheduling-row"
                  >
                    <div class="scheduling-row__info">
                      <span class="scheduling-row__title">
                        {{ scheduling.Parameters?.ThemeTitle || `Schedule #${scheduling.Id}` }}
                      </span>
                      <span v-if="scheduling.Parameters?.Description" class="scheduling-row__desc">
                        {{ scheduling.Parameters.Description }}
                      </span>
                    </div>
                    <div class="scheduling-row__meta">
                      <span
                        class="scheduling-row__status"
                        :class="scheduling.Status === 0 ? 'scheduling-row__status--active' : 'scheduling-row__status--inactive'"
                      >
                        {{ scheduling.Status === 0 ? 'Active' : 'Inactive' }}
                      </span>
                      <span v-if="scheduling.Interval" class="scheduling-row__interval">
                        {{ displayInterval(scheduling) }}
                      </span>
                      <svg class="scheduling-row__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </div>
                  </router-link>

                  <div class="home__btn-wrapper">
                    <router-link
                      v-if="config.RemainingRunsPerWeek > 0"
                      :to="`/configurations/${config.Id}/schedulings/new`"
                      class="config-item__add-scheduling"
                    >
                      + New Schedule
                    </router-link>
                    <span v-else class="config-item__add-scheduling config-item__add-scheduling--disabled">
                      <SvgIcon name="lock" :size="12" class="home__lock-icon" />
                      New Schedule
                    </span>
                    <div v-if="config.RemainingRunsPerWeek <= 0" class="home__limit-tooltip home__limit-tooltip--left">
                      You have reached the maximum number of weekly posts for this connection.
                      <router-link :to="{ name: 'ProfilePlan' }" class="home__limit-tooltip-link">Click here</router-link>
                      to upgrade your plan.
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Tab: Schedules -->
        <div v-else-if="activeTab === 'schedulings' && totalConfigs > 0" key="schedulings">
          <div class="home__section-header">
            <h2 class="home__section-title">All Schedules</h2>
          </div>

          <div v-if="allSchedulings.length === 0" class="home__empty-tab">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#cbd5e1" stroke-width="1.5"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p>No schedules found.</p>
            <span>Create a schedule within a connection.</span>
          </div>

          <div v-else class="home__schedulings-list">
            <router-link
              v-for="item in allSchedulings"
              :key="`${item.configId}-${item.scheduling.Id}`"
              :to="`/configurations/${item.configId}/schedulings/${item.scheduling.Id}`"
              class="scheduling-card"
            >
              <div class="scheduling-card__left">
                <span class="scheduling-card__title">
                  {{ item.scheduling.Parameters?.ThemeTitle || `Schedule #${item.scheduling.Id}` }}
                </span>
                <span v-if="item.scheduling.Parameters?.Description" class="scheduling-card__desc">
                  {{ item.scheduling.Parameters.Description }}
                </span>
                <div class="scheduling-card__tags">
                  <span class="scheduling-card__tag scheduling-card__tag--platform">
                    <PlatformIcon :platform-id="item.platformId" />
                    {{ platformLabel(item.platformId) }}
                  </span>
                  <span class="scheduling-card__tag scheduling-card__tag--config">
                    {{ formatName(item.configUrl) }}
                  </span>
                  <span v-if="item.scheduling.Interval" class="scheduling-card__tag scheduling-card__tag--cron">
                    {{ displayInterval(item.scheduling) }}
                  </span>
                  <span
                    class="scheduling-card__tag"
                    :class="item.scheduling.Status === 0 ? 'scheduling-card__tag--status-active' : 'scheduling-card__tag--status-inactive'"
                  >
                    {{ item.scheduling.Status === 0 ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <svg class="scheduling-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
      </transition>
    </template>

    <!-- Edit connection modal -->
    <BaseModal
      :show="showEditModal"
      title="Edit Connection"
      @close="showEditModal = false"
    >
      <form @submit.prevent="submitEditConfig" class="config-edit-form">
        <BaseInput
          v-model="editForm.PlatformName"
          label="Connection Name"
          placeholder="My website"
        />
        <BaseInput
          v-model="editForm.Url"
          label="Website URL"
          placeholder="https://mysite.com"
        />
        <BaseInput
          v-model="editForm.Username"
          label="Username"
          placeholder="Username"
          tooltip="This is not your WordPress admin login. Go to your WordPress admin panel → Users → Add New User, create a user with at least the 'Author' role, and enter that username here."
        />
        <BaseInput
          v-model="editForm.Password"
          label="Password"
          type="password"
          placeholder="Leave blank to keep current"
        />
        <div class="config-edit-form__actions">
          <BaseButton type="submit" :loading="editLoading">Save</BaseButton>
          <BaseButton variant="secondary" @click="showEditModal = false">Cancel</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete connection confirmation -->
    <ConfirmModal
      :show="showDeleteConfigModal"
      title="Delete Connection"
      message="Are you sure you want to delete this connection? All its schedules will also be removed."
      :loading="deleteLoading"
      @confirm="confirmDeleteConfig"
      @cancel="showDeleteConfigModal = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useConfigurations } from '@/composables/useConfigurations'
import { useSubscription } from '@/composables/useSubscription'
import { useToast } from '@/composables/useToast'
import PlatformIcon from '@/components/configuration/PlatformIcon.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import schedulingService from '@/services/schedulingService'
import { cronUtcToTimezone } from '@/utils/cronTimezone'
import type { Configuration, Scheduling } from '@/types'

interface SchedulingItem {
  configId: number
  configUrl: string
  platformId: number
  scheduling: Scheduling
}

export default defineComponent({
  name: 'HomeView',
  components: { PlatformIcon, SvgIcon, BaseModal, BaseInput, BaseButton, ConfirmModal },
  inject: {
    openNewConfigurationModal: { default: () => function noop() { /* noop */ } }
  },
  data() {
    return {
      activeTab: 'configurations' as string,
      expandedConfigs: [] as number[],
      hasSuspendedNopayment: false,
      hasSuspendedDowngrade: false,
      // Edit connection
      showEditModal: false,
      editLoading: false,
      editConfigId: null as number | null,
      editForm: { PlatformName: '', Url: '', Username: '', Password: '' },
      // Delete connection
      showDeleteConfigModal: false,
      deleteLoading: false,
      deleteConfigId: null as number | null
    }
  },
  async mounted() {
    const { fetchRemainingConfigurations } = useSubscription()
    const [nopayment, downgrade] = await Promise.all([
      schedulingService.hasSuspendedNopayment().catch(() => ({ data: false })),
      schedulingService.hasSuspendedDowngrade().catch(() => ({ data: false })),
      fetchRemainingConfigurations()
    ])
    this.hasSuspendedNopayment = nopayment.data
    this.hasSuspendedDowngrade = downgrade.data
  },
  computed: {
    loading(): boolean {
      const { loading } = useConfigurations()
      return loading.value
    },
    canCreateConfig(): boolean {
      const { canCreateConfig } = useSubscription()
      return canCreateConfig.value
    },
    configurations(): Configuration[] {
      const { configurations } = useConfigurations()
      return configurations.value
    },
    totalConfigs(): number {
      return this.configurations.length
    },
    totalSchedulings(): number {
      return this.configurations.reduce((sum: number, c: Configuration) =>
        sum + (c.Schedulings || []).filter((s: Scheduling) => s.Status === 0).length, 0)
    },
    stripePortalUrl(): string {
      return process.env.VUE_APP_STRIPE_CUSTOMER_PORTAL || ''
    },
    allSchedulings(): SchedulingItem[] {
      const result: SchedulingItem[] = []
      for (const config of this.configurations) {
        for (const scheduling of (config.Schedulings || [])) {
          result.push({
            configId: config.Id,
            configUrl: config.Url,
            platformId: config.PlatformId,
            scheduling
          })
        }
      }
      return result
    }
  },
  methods: {
    displayInterval(scheduling: Scheduling): string {
      if (!scheduling?.Interval) return ''
      return scheduling.Timezone
        ? cronUtcToTimezone(scheduling.Interval, scheduling.Timezone)
        : scheduling.Interval
    },
    platformLabel(platformId: number): string {
      const map: Record<number, string> = { 1: 'WordPress', 2: 'Instagram' }
      return map[platformId] || 'Platform'
    },
    formatName(name: string): string {
      if (!name) return 'No name'
      return name;
    },
    isExpanded(id: number): boolean {
      return this.expandedConfigs.includes(id)
    },
    toggleConfig(id: number): void {
      const idx = this.expandedConfigs.indexOf(id)
      if (idx >= 0) {
        this.expandedConfigs.splice(idx, 1)
      } else {
        this.expandedConfigs.push(id)
      }
    },
    openNewConfig(platformId: number): void {
      (this.openNewConfigurationModal as (id: number) => void)(platformId)
    },
    openEditConfig(config: Configuration): void {
      this.editConfigId = config.Id
      this.editForm = {
        PlatformName: config.PlatformName,
        Url: config.Url,
        Username: config.Username,
        Password: ''
      }
      this.showEditModal = true
    },
    async submitEditConfig(): Promise<void> {
      if (!this.editConfigId) return
      this.editLoading = true
      const { success, error } = useToast()
      try {
        const { update } = useConfigurations()
        await update(this.editConfigId, this.editForm)
        success('Connection updated successfully!')
        this.showEditModal = false
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } } }
        error(err.response?.data?.Message || 'Failed to update connection')
      } finally {
        this.editLoading = false
      }
    },
    openDeleteConfig(config: Configuration): void {
      this.deleteConfigId = config.Id
      this.showDeleteConfigModal = true
    },
    async confirmDeleteConfig(): Promise<void> {
      if (!this.deleteConfigId) return
      this.deleteLoading = true
      const { success, error } = useToast()
      try {
        const { remove } = useConfigurations()
        const { fetchRemainingConfigurations } = useSubscription()
        await remove(this.deleteConfigId)
        await fetchRemainingConfigurations()
        success('Connection deleted successfully!')
        this.showDeleteConfigModal = false
        this.deleteConfigId = null
      } catch (e: unknown) {
        const err = e as { response?: { data?: { Message?: string } } }
        error(err.response?.data?.Message || 'Failed to delete connection')
      } finally {
        this.deleteLoading = false
      }
    }
  }
})
</script>

<style scoped>
.home__header {
  margin-bottom: var(--spacing-xl);
}

.home__title {
  font-size: var(--font-size-2xl);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-xs);
}

.home__subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
}

.home__banner {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.home__banner--warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.home__banner-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.home__loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

/* Stat Cards */
.home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: all var(--transition-normal);
  text-align: left;
  width: 100%;
}

.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.stat-card--active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.stat-card--active .stat-card__label {
  color: var(--color-primary);
  font-weight: 600;
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__icon--blue {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.stat-card__icon--green {
  background: var(--color-success-light);
  color: var(--color-success);
}

.stat-card__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-card__value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.stat-card__label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

/* Empty tab state */
.home__empty-tab {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  color: var(--color-gray-400);
}

.home__empty-tab p {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.home__empty-tab span {
  font-size: var(--font-size-sm);
}

/* Empty state */
.home__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

.home__empty-icon {
  margin-bottom: var(--spacing-lg);
}

.home__empty h3 {
  font-size: var(--font-size-lg);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-sm);
}

.home__empty p {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xl);
}

.home__empty-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.home__empty-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.home__empty-btn--disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

/* Section header */
.home__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.home__section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
}

.home__new-config-btn {
  padding: 8px 16px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.home__new-config-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.home__new-config-btn--disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

/* Btn wrapper + tooltip */
.home__btn-wrapper {
  position: relative;
  display: inline-block;
}

.home__lock-icon {
  vertical-align: middle;
  margin-right: 4px;
}

.home__limit-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: #1e293b;
  color: #f8fafc;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  width: 300px;
  text-align: left;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s, visibility 0.2s;
}

.home__limit-tooltip::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 12px;
}

.home__limit-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 24px;
  border-width: 6px;
  border-style: solid;
  border-color: #1e293b transparent transparent transparent;
}

.home__btn-wrapper:hover .home__limit-tooltip {
  visibility: visible;
  opacity: 1;
}

.home__limit-tooltip-link {
  color: #60a5fa;
  text-decoration: underline;
}

/* Configuration items */
.home__configs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-item {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-normal);
}

.config-item:hover {
  border-color: var(--color-gray-300);
}

.config-item__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.config-item__header:hover {
  background: var(--color-gray-50);
}

.config-item__platform {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.config-item__platform-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.config-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.config-item__url {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-item__user {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.config-item__badge {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.config-item__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.config-item__action-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.config-item__action-btn:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.config-item__action-btn--danger:hover {
  color: #dc2626;
  background: #fef2f2;
}

.config-edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-edit-form__actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.config-item__expand {
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-normal);
}

.config-item__expand--open {
  transform: rotate(180deg);
}

/* Expanded body */
.config-item__body {
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md) var(--spacing-xl) var(--spacing-lg);
}

.config-item__empty {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

/* Scheduling rows */
.scheduling-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background var(--transition-fast);
  cursor: pointer;
}

.scheduling-row:hover {
  background: var(--color-gray-50);
  text-decoration: none;
}

.scheduling-row__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.scheduling-row__title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-row__desc {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.scheduling-row__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.scheduling-row__interval {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  font-family: monospace;
  background: var(--color-gray-100);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
}

.scheduling-row__status {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.scheduling-row__status--active {
  color: #15803d;
  background: #f0fdf4;
}

.scheduling-row__status--inactive {
  color: #b91c1c;
  background: #fef2f2;
}

.scheduling-row__arrow {
  color: var(--color-gray-400);
}

.scheduling-row:hover .scheduling-row__arrow {
  color: var(--color-primary);
}

.config-item__add-scheduling {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background var(--transition-fast);
  margin-top: var(--spacing-xs);
}

.config-item__add-scheduling:hover {
  background: var(--color-primary-light);
  text-decoration: none;
}

.config-item__add-scheduling--disabled {
  color: var(--color-gray-400);
  cursor: not-allowed;
}

.config-item__add-scheduling--disabled:hover {
  background: none;
}

.home__limit-tooltip--left {
  right: auto;
  left: 0;
}

.home__limit-tooltip--left::after {
  right: auto;
  left: 24px;
}

/* Scheduling cards (tab agendamentos) */
.home__schedulings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.scheduling-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.scheduling-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  text-decoration: none;
}

.scheduling-card__left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scheduling-card__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-card__tags {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
  flex-wrap: wrap;
}

.scheduling-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
}

.scheduling-card__tag--platform {
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
  font-weight: 600;
}

.scheduling-card__tag--config {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.scheduling-card__tag--cron {
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  font-family: monospace;
}

.scheduling-card__tag--status-active {
  color: #15803d;
  background: #f0fdf4;
  font-weight: 600;
}

.scheduling-card__tag--status-inactive {
  color: #b91c1c;
  background: #fef2f2;
  font-weight: 600;
}

.scheduling-card__arrow {
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.scheduling-card:hover .scheduling-card__arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}

/* Fade transition (tab switch) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Expand transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
