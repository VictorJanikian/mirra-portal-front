<template>
  <div class="multiselect" ref="container">
    <div
      class="multiselect__trigger"
      :class="{ active: open }"
      @click="toggle"
    >
      <span class="multiselect__value">{{ displayValue }}</span>
      <svg class="multiselect__arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <transition name="dropdown">
      <div v-if="open" class="multiselect__dropdown">
        <!-- Wildcard option -->
        <label class="multiselect__option">
          <input
            type="checkbox"
            :checked="isWildcard"
            @change="selectWildcard"
          />
          <span>{{ wildcardLabel }}</span>
        </label>

        <!-- Unselected option (for days/weekdays) -->
        <label v-if="showUnselected" class="multiselect__option">
          <input
            type="checkbox"
            :checked="isUnselected"
            @change="selectUnselected"
          />
          <span>Não Selecionado</span>
        </label>

        <div class="multiselect__divider" />

        <!-- Regular options -->
        <label
          v-for="opt in options"
          :key="opt.value"
          class="multiselect__option"
        >
          <input
            type="checkbox"
            :value="opt.value"
            :checked="isSelected(opt.value)"
            @change="toggleOption(opt.value)"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BaseMultiSelect',
  props: {
    modelValue: { type: Array, default: () => ['*'] },
    options: { type: Array, required: true },
    wildcardLabel: { type: String, default: 'Todos' },
    showUnselected: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  data() {
    return { open: false }
  },
  computed: {
    isWildcard() {
      return this.modelValue.includes('*')
    },
    isUnselected() {
      return this.modelValue.includes('?')
    },
    displayValue() {
      if (this.isWildcard) return this.wildcardLabel
      if (this.isUnselected) return 'Não Selecionado'
      if (this.modelValue.length === 0) return this.wildcardLabel
      const labels = this.modelValue.map(v => {
        const opt = this.options.find(o => String(o.value) === String(v))
        return opt ? opt.label : v
      })
      if (labels.length <= 3) return labels.join(', ')
      return `${labels.length} selecionados`
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    close() {
      this.open = false
    },
    selectWildcard() {
      this.$emit('update:modelValue', ['*'])
    },
    selectUnselected() {
      this.$emit('update:modelValue', ['?'])
    },
    isSelected(value) {
      return this.modelValue.includes(String(value))
    },
    toggleOption(value) {
      const strValue = String(value)
      let newValues

      if (this.isWildcard || this.isUnselected) {
        newValues = [strValue]
      } else if (this.isSelected(strValue)) {
        newValues = this.modelValue.filter(v => v !== strValue)
        if (newValues.length === 0) newValues = ['*']
      } else {
        newValues = [...this.modelValue, strValue]
      }

      this.$emit('update:modelValue', newValues)
    },
    handleClickOutside(e) {
      if (this.$refs.container && !this.$refs.container.contains(e.target)) {
        this.close()
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
.multiselect {
  position: relative;
  width: 100%;
}

.multiselect__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid var(--border-input);
  border-radius: var(--border-radius);
  background: var(--color-white);
  cursor: pointer;
  transition: all var(--transition-normal);
  user-select: none;
}

.multiselect__trigger:hover {
  border-color: var(--color-gray-400);
}

.multiselect__trigger.active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.multiselect__value {
  font-size: var(--font-size-base);
  color: var(--color-gray-700);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multiselect__arrow {
  flex-shrink: 0;
  transition: transform var(--transition-normal);
  color: var(--color-gray-500);
}

.multiselect__trigger.active .multiselect__arrow {
  transform: rotate(180deg);
}

.multiselect__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--border-input);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 280px;
  overflow-y: auto;
}

.multiselect__option {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  transition: background var(--transition-fast);
  user-select: none;
}

.multiselect__option:hover {
  background: var(--color-gray-100);
}

.multiselect__option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0 10px 0 0;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.multiselect__option span {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.multiselect__option input[type="checkbox"]:checked + span {
  font-weight: 500;
  color: var(--color-primary-dark);
}

.multiselect__divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.dropdown-enter-active {
  animation: dropdownSlide 0.2s ease;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
