<template>
  <div class="form-field">
    <label v-if="label" :for="fieldId" class="form-field__label">
      {{ label }}
      <BaseTooltip v-if="tooltip" :text="tooltip" />
    </label>

    <div v-if="suggestions.length" class="suggestion-field__chips">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        type="button"
        class="suggestion-field__chip"
        :class="{ 'suggestion-field__chip--active': modelValue === suggestion }"
        @click="applySuggestion(suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>

    <textarea
      :id="fieldId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      class="form-field__textarea"
      :class="{ 'form-field__textarea--error': error }"
    />

    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import BaseTooltip from './BaseTooltip.vue'

let uid = 0

export default defineComponent({
  name: 'SuggestionTextarea',
  components: { BaseTooltip },
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    rows: { type: [String, Number], default: 3 },
    maxlength: { type: [String, Number], default: 1500 },
    suggestions: { type: Array as PropType<string[]>, default: () => [] }
  },
  emits: ['update:modelValue'],
  setup() {
    uid++
    return { fieldId: `field-suggestion-${uid}` }
  },
  methods: {
    applySuggestion(suggestion: string): void {
      this.$emit('update:modelValue', this.modelValue === suggestion ? '' : suggestion)
    }
  }
})
</script>

<style scoped>
.suggestion-field__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs, 6px);
  margin-bottom: var(--spacing-sm, 8px);
}

.suggestion-field__chip {
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-200, #e5e7eb);
  color: var(--color-gray-600, #4b5563);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: var(--font-size-xs, 12px);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
}

.suggestion-field__chip:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.suggestion-field__chip--active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 600;
}
</style>
