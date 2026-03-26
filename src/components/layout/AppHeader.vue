<template>
  <header class="app-header">
    <button class="app-header__menu-btn" @click="$emit('toggle-sidebar')">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="app-header__spacer" />

    <router-link
      v-if="subscriptionLoaded"
      to="/profile/plan"
      class="app-header__upgrade-btn"
      :class="{ 'app-header__upgrade-btn--disabled': isOnHighestPlan }"
      :tabindex="isOnHighestPlan ? -1 : 0"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-bottom: 4px;">
        <path d="M8 2L14 8H10V14H6V8H2L8 2Z" fill="currentColor"/>
      </svg>
      {{ isOnHighestPlan ? 'Max plan' : 'Upgrade' }}
    </router-link>

    <div class="app-header__user" ref="userMenu">
      <button class="app-header__user-btn" @click="menuOpen = !menuOpen">
        <span class="app-header__avatar">{{ initials }}</span>
        <span class="app-header__user-name">{{ userName }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <transition name="dropdown">
        <div v-if="menuOpen" class="app-header__dropdown">
          <router-link to="/profile" class="app-header__dropdown-item" @click="menuOpen = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/>
              <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Profile
          </router-link>
          <router-link to="/settings" class="app-header__dropdown-item" @click="menuOpen = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Preferences
          </router-link>
          <div class="app-header__dropdown-divider" />
          <button class="app-header__dropdown-item app-header__dropdown-item--danger" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSubscription } from '@/composables/useSubscription'

export default defineComponent({
  name: 'AppHeader',
  emits: ['toggle-sidebar'],
  data() {
    return { menuOpen: false }
  },
  computed: {
    userName(): string {
      const { state } = useAuth()
      return state.user?.Name || 'User'
    },
    initials(): string {
      const name = this.userName
      const parts = name.split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return name.substring(0, 2).toUpperCase()
    },
    subscriptionLoaded(): boolean {
      const { plans } = useSubscription()
      return plans.value.length > 0
    },
    isOnHighestPlan(): boolean {
      const { isOnHighestPlan } = useSubscription()
      return isOnHighestPlan.value
    }
  },
  methods: {
    handleLogout(): void {
      this.menuOpen = false
      const { logout } = useAuth()
      logout()
    },
    handleClickOutside(e: MouseEvent): void {
      const userMenu = this.$refs.userMenu as HTMLElement | undefined
      if (userMenu && !userMenu.contains(e.target as Node)) {
        this.menuOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    const { fetchAll } = useSubscription()
    fetchAll()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
})
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--color-white);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-xl);
  gap: var(--spacing-md);
}

.app-header__menu-btn {
  display: none;
  color: var(--color-gray-600);
  padding: 6px;
  border-radius: var(--border-radius-sm);
  transition: background var(--transition-fast);
}

.app-header__menu-btn:hover {
  background: var(--color-gray-100);
}

.app-header__spacer {
  flex: 1;
}

.app-header__user {
  position: relative;
}

.app-header__user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  transition: background var(--transition-fast);
  color: var(--color-gray-700);
}

.app-header__user-btn:hover {
  background: var(--color-gray-100);
}

.app-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.app-header__user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.app-header__upgrade-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  margin-right: var(--spacing-md);
}

.app-header__upgrade-btn:hover {
  background: var(--color-primary-hover);
  text-decoration: none;
  transform: translateY(-1px);
}

.app-header__upgrade-btn--disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  pointer-events: none;
}

.app-header__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}

.app-header__dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  transition: background var(--transition-fast);
  text-decoration: none;
  width: 100%;
  text-align: left;
}

.app-header__dropdown-item:hover {
  background: var(--color-gray-50);
  text-decoration: none;
}

.app-header__dropdown-item--danger {
  color: var(--color-danger);
}

.app-header__dropdown-divider {
  height: 1px;
  background: var(--border-color);
}

.dropdown-enter-active {
  animation: dropdownSlide 0.15s ease;
}

@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 992px) {
  .app-header__menu-btn {
    display: flex;
  }
}
</style>
