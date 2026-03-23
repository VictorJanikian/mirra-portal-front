<template>
  <div class="scheduling-list">
    <div class="scheduling-list__header">
      <h2>Agendamentos</h2>
    </div>

    <ul class="scheduling-list__items">
      <li
        v-for="scheduling in schedulings"
        :key="scheduling.Id"
        class="scheduling-item-wrapper"
      >
        <button
          class="scheduling-item-delete"
          @click.stop="$emit('delete', scheduling)"
          title="Remover agendamento"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M2 2l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div
          class="scheduling-item"
          :class="{ active: scheduling.Id === activeId }"
          @click="$emit('select', scheduling)"
        >
          <span class="scheduling-item__label">
            {{ scheduling.Parameters?.ThemeTitle || `Agendamento #${scheduling.Id}` }}
          </span>
          <span
            class="scheduling-item__status"
            :class="scheduling.Status === 0 ? 'scheduling-item__status--active' : 'scheduling-item__status--inactive'"
          >
            {{ scheduling.Status === 0 ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
      </li>

      <li class="scheduling-list__add-wrapper">
        <div
          v-if="canCreate"
          class="scheduling-item scheduling-item--add"
          @click="$emit('create')"
        >
          + Criar novo
        </div>
        <div v-else class="scheduling-item scheduling-item--add scheduling-item--disabled">
          <SvgIcon name="lock" :size="12" class="scheduling-list__lock-icon" />
          Criar novo
        </div>
        <div v-if="!canCreate" class="scheduling-list__limit-tooltip">
          Você atingiu o número máximo de posts semanais para essa conexão.
          <router-link :to="{ name: 'ProfilePlan' }" class="scheduling-list__limit-tooltip-link">Clique aqui</router-link>
          para atualizar seu plano.
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import type { Scheduling } from '@/types'

export default defineComponent({
  name: 'SchedulingList',
  components: { SvgIcon },
  props: {
    schedulings: { type: Array as PropType<Scheduling[]>, default: () => [] },
    activeId: { type: Number, default: null },
    canCreate: { type: Boolean, default: true }
  },
  emits: ['select', 'create', 'delete']
})
</script>

<style scoped>
.scheduling-list {
  flex: 0 0 320px;
  border-right: 1px solid var(--border-color);
  padding-right: 24px;
  display: flex;
  flex-direction: column;
}

.scheduling-list__header {
  margin-bottom: 20px;
}

.scheduling-list__header h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.scheduling-list__items {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  scrollbar-width: thin;
}

.scheduling-item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 32px;
  margin-left: -32px;
}

.scheduling-item {
  flex: 1;
  border: 1px dashed #93c5fd;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
  padding: 14px;
  transition: all var(--transition-normal);
  border-radius: 6px;
  cursor: pointer;
  font-size: var(--font-size-base);
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-gray-700);
}

.scheduling-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scheduling-item__status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.scheduling-item__status--active {
  color: #15803d;
  background: #f0fdf4;
}

.scheduling-item__status--inactive {
  color: #b91c1c;
  background: #fef2f2;
}

.scheduling-item:hover {
  background: #e0f2fe;
  color: var(--color-primary-dark);
  border-color: #93c5fd;
}

.scheduling-item.active {
  background: var(--color-primary-light);
  border-color: #93c5fd;
  color: var(--color-primary-darkest);
}

.scheduling-item--add {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  margin-top: 8px;
}

.scheduling-item--add:hover {
  background: var(--color-primary-hover);
  color: var(--color-white);
}

.scheduling-item--disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

.scheduling-item--disabled:hover {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
}

.scheduling-list__lock-icon {
  vertical-align: middle;
  margin-right: 4px;
}

.scheduling-list__add-wrapper {
  position: relative;
}

.scheduling-list__limit-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #1e293b;
  color: #f8fafc;
  padding: 10px 14px;
  border-radius: var(--border-radius, 8px);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  width: 100%;
  text-align: left;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s, visibility 0.2s;
}

.scheduling-list__limit-tooltip::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 12px;
}

.scheduling-list__limit-tooltip::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 24px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent #1e293b transparent;
}

.scheduling-list__add-wrapper:hover .scheduling-list__limit-tooltip {
  visibility: visible;
  opacity: 1;
}

.scheduling-list__limit-tooltip-link {
  color: #60a5fa;
  text-decoration: underline;
}

.scheduling-item-delete {
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-30%);
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
  pointer-events: none;
}

.scheduling-item-wrapper:hover .scheduling-item-delete {
  opacity: 1;
  pointer-events: all;
}

.scheduling-item-delete:hover {
  background: var(--color-danger-hover);
  transform: translateY(-30%) scale(1.1);
}

@media (max-width: 992px) {
  .scheduling-list {
    flex: none;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding-right: 0;
    padding-bottom: var(--spacing-lg);
  }
}
</style>
