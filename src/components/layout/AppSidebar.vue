<template>
  <aside class="sidebar" :class="{ 'sidebar--open': mobileOpen }">
    <div class="sidebar__header">
      <router-link to="/" class="sidebar__brand">MIRRA AI</router-link>
    </div>

    <nav class="sidebar__nav">
      <div class="sidebar__section">
        <div class="sidebar__section-title">Plataformas</div>

        <!-- WordPress -->
        <div class="sidebar__platform">
          <button
            class="sidebar__platform-btn"
            :class="{ active: expandedPlatform === 1 }"
            @click="togglePlatform(1)"
          >
            <svg class="sidebar__platform-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.5 17.82c-3.584-.698-6.32-3.874-6.32-7.66 0-.63.082-1.24.222-1.828L8.9 14.83v.99c0 1.1.9 2 2 2v1zm6.52-2.73c-.26-.8-1.01-1.39-1.9-1.39h-.6v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V6.7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            WordPress
            <svg class="sidebar__expand-icon" :class="{ rotated: expandedPlatform === 1 }" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <transition name="expand">
            <div v-if="expandedPlatform === 1" class="sidebar__configs">
              <div
                v-for="config in wordpressConfigs"
                :key="config.Id"
                class="sidebar__config"
              >
                <button
                  class="sidebar__config-btn"
                  :class="{ active: expandedConfig === config.Id }"
                  @click="toggleConfig(config.Id)"
                >
                  <span class="sidebar__config-url">{{ formatUrl(config.Url) }}</span>
                  <span class="sidebar__config-badge">{{ (config.Schedulings || []).length }}</span>
                </button>

                <transition name="expand">
                  <div v-if="expandedConfig === config.Id" class="sidebar__schedulings">
                    <router-link
                      v-for="scheduling in (config.Schedulings || [])"
                      :key="scheduling.Id"
                      :to="`/configurations/${config.Id}/schedulings/${scheduling.Id}`"
                      class="sidebar__scheduling-link"
                      active-class="active"
                    >
                      {{ scheduling.Parameters?.ThemeTitle || `Agendamento #${scheduling.Id}` }}
                    </router-link>

                    <router-link
                      :to="`/configurations/${config.Id}/schedulings/new`"
                      class="sidebar__add-scheduling"
                    >
                      + Novo Agendamento
                    </router-link>
                  </div>
                </transition>
              </div>

              <button class="sidebar__add-config" @click="$emit('new-configuration', 1)">
                + Conectar site
              </button>
            </div>
          </transition>
        </div>

        <!-- Instagram -->
        <div class="sidebar__platform">
          <button
            class="sidebar__platform-btn sidebar__platform-btn--disabled"
            @click="togglePlatform(2)"
          >
            <svg class="sidebar__platform-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Instagram
            <span class="sidebar__coming-soon">Em breve</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="sidebar__footer">
      <router-link to="/profile" class="sidebar__footer-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/>
          <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Perfil
      </router-link>
      <router-link to="/settings" class="sidebar__footer-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Preferências
      </router-link>
      <button class="sidebar__footer-link sidebar__footer-link--danger" @click="handleLogout">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Sair
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useConfigurations } from '@/composables/useConfigurations'
import type { Configuration } from '@/types'

export default defineComponent({
  name: 'AppSidebar',
  emits: ['new-configuration'],
  props: {
    mobileOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      expandedPlatform: null as number | null,
      expandedConfig: null as number | null
    }
  },
  computed: {
    wordpressConfigs(): Configuration[] {
      const { configurations } = useConfigurations()
      return configurations.value.filter((c: Configuration) => c.PlatformId === 1)
    }
  },
  methods: {
    togglePlatform(id: number): void {
      this.expandedPlatform = this.expandedPlatform === id ? null : id
    },
    toggleConfig(id: number): void {
      this.expandedConfig = this.expandedConfig === id ? null : id
    },
    formatUrl(url: string): string {
      if (!url) return 'Sem URL'
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    },
    handleLogout(): void {
      const { logout } = useAuth()
      logout()
    }
  },
  mounted() {
    const { fetchAll } = useConfigurations()
    fetchAll()
    this.expandedPlatform = 1
  }
})
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-white);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
}

.sidebar__header {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.sidebar__brand {
  font-size: var(--font-size-lg);
  font-weight: 800;
  color: var(--color-gray-900);
  text-decoration: none;
  letter-spacing: 0.05em;
  display: block;
}

.sidebar__brand:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.sidebar__nav {
  flex: 1;
  padding: var(--spacing-md) 0;
  overflow-y: auto;
}

.sidebar__section {
  padding: 0 var(--spacing-md);
}

.sidebar__section-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-sm) var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.sidebar__platform {
  margin-bottom: var(--spacing-xs);
}

.sidebar__platform-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  transition: all var(--transition-fast);
  text-align: left;
}

.sidebar__platform-btn:hover {
  background: var(--color-gray-100);
}

.sidebar__platform-btn.active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.sidebar__platform-btn--disabled {
  opacity: 0.6;
  cursor: default;
}

.sidebar__platform-icon {
  flex-shrink: 0;
}

.sidebar__expand-icon {
  margin-left: auto;
  transition: transform var(--transition-normal);
  color: var(--color-gray-400);
}

.sidebar__expand-icon.rotated {
  transform: rotate(90deg);
}

.sidebar__coming-soon {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  background: var(--color-gray-100);
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar__configs {
  padding-left: var(--spacing-lg);
  margin-top: var(--spacing-xs);
}

.sidebar__config {
  margin-bottom: 2px;
}

.sidebar__config-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  transition: all var(--transition-fast);
  text-align: left;
}

.sidebar__config-btn:hover {
  background: var(--color-gray-100);
}

.sidebar__config-btn.active {
  background: var(--color-primary-lighter);
  color: var(--color-primary-dark);
}

.sidebar__config-url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.sidebar__config-badge {
  background: var(--color-gray-200);
  color: var(--color-gray-600);
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 10px;
  flex-shrink: 0;
}

.sidebar__schedulings {
  padding-left: var(--spacing-md);
  margin-top: var(--spacing-xs);
}

.sidebar__scheduling-link {
  display: block;
  padding: 6px 12px;
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__scheduling-link:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  text-decoration: none;
}

.sidebar__scheduling-link.active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 500;
}

.sidebar__add-scheduling {
  display: block;
  padding: 6px 12px;
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  transition: background var(--transition-fast);
}

.sidebar__add-scheduling:hover {
  background: var(--color-primary-light);
  text-decoration: none;
}

.sidebar__add-config {
  width: 100%;
  padding: 8px 12px;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  text-align: left;
  border-radius: var(--border-radius-sm);
  transition: background var(--transition-fast);
  margin-top: var(--spacing-xs);
}

.sidebar__add-config:hover {
  background: var(--color-primary-light);
}

.sidebar__footer {
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md);
}

.sidebar__footer-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  text-decoration: none;
  width: 100%;
  text-align: left;
}

.sidebar__footer-link:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-800);
  text-decoration: none;
}

.sidebar__footer-link--danger:hover {
  color: var(--color-danger);
  background: var(--color-danger-light);
}

/* Expand transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
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
  max-height: 500px;
}

/* Mobile */
@media (max-width: 992px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-slow);
    box-shadow: none;
  }

  .sidebar--open {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }
}
</style>
