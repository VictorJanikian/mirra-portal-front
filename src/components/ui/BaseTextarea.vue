<template>
  <div class="form-field">
    <label v-if="label" :for="fieldId" class="form-field__label">
      {{ label }}
      <BaseTooltip v-if="tooltip" :text="tooltip" />
    </label>
    <textarea
      :id="fieldId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="form-field__textarea"
      :class="{ 'form-field__textarea--error': error }"
    />
    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>

<script>
import BaseTooltip from './BaseTooltip.vue'

let uid = 0

export default {
  name: 'BaseTextarea',
  components: { BaseTooltip },
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    rows: { type: [String, Number], default: 4 }
  },
  emits: ['update:modelValue'],
  setup() {
    uid++
    return { fieldId: `field-textarea-${uid}` }
  }
}
</script>
