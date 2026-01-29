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
          {{ scheduling.Parameters?.ThemeTitle || `Agendamento #${scheduling.Id}` }}
        </div>
      </li>

      <li>
        <div
          class="scheduling-item scheduling-item--add"
          @click="$emit('create')"
        >
          + Criar novo
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SchedulingList',
  props: {
    schedulings: { type: Array, default: () => [] },
    activeId: { type: Number, default: null }
  },
  emits: ['select', 'create', 'delete']
}
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
  color: var(--color-gray-700);
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
