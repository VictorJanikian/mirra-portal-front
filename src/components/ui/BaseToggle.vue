<template>
  <div class="base-toggle">
    <button
      :id="fieldId"
      type="button"
      role="switch"
      :aria-checked="String(modelValue)"
      :disabled="disabled"
      class="base-toggle__switch"
      :class="{ 'base-toggle__switch--on': modelValue }"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="base-toggle__knob" />
    </button>
    <label :for="fieldId" class="form-field__label base-toggle__label">
      {{ label }}
      <BaseTooltip v-if="tooltip" :text="tooltip" />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseTooltip from './BaseTooltip.vue'

let uid = 0

export default defineComponent({
  name: 'BaseToggle',
  components: { BaseTooltip },
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup() {
    uid++
    return { fieldId: `field-toggle-${uid}` }
  }
})
</script>

<style scoped>
.base-toggle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-md, 12px);
}

.base-toggle__label {
  margin: 0;
  cursor: pointer;
}

.base-toggle__switch {
  flex-shrink: 0;
  width: 42px;
  height: 24px;
  padding: 2px;
  border: none;
  border-radius: 12px;
  background: var(--color-gray-300, #d1d5db);
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s);
}

.base-toggle__switch--on {
  background: #2563eb;
}

.base-toggle__switch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-toggle__knob {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-fast, 0.15s);
}

.base-toggle__switch--on .base-toggle__knob {
  transform: translateX(18px);
}
</style>
