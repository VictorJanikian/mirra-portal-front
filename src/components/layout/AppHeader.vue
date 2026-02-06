<template>
  <header class="app-header">
    <button class="app-header__menu-btn" @click="$emit('toggle-sidebar')">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="app-header__spacer" />

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
            Perfil
          </router-link>
          <router-link to="/settings" class="app-header__dropdown-item" @click="menuOpen = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Preferências
          </router-link>
          <div class="app-header__dropdown-divider" />
          <button class="app-header__dropdown-item app-header__dropdown-item--danger" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sair
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'AppHeader',
  emits: ['toggle-sidebar'],
  data() {
    return { menuOpen: false }
  },
  computed: {
    userName() {
      const { state } = useAuth()
      return state.user?.Name || 'Usuário'
    },
    initials() {
      const name = this.userName
      const parts = name.split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      return name.substring(0, 2).toUpperCase()
    }
  },
  methods: {
    handleLogout() {
      this.menuOpen = false
      const { logout } = useAuth()
      logout()
    },
    handleClickOutside(e) {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(e.target)) {
        this.menuOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
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
