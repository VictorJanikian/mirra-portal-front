<template>
  <div class="form-field">
    <label v-if="label" :for="fieldId" class="form-field__label">
      {{ label }}
      <BaseTooltip v-if="tooltip" :text="tooltip" />
    </label>
    <select
      :id="fieldId"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="form-field__select"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>

<script>
import BaseTooltip from './BaseTooltip.vue'

let uid = 0

export default {
  name: 'BaseSelect',
  components: { BaseTooltip },
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup() {
    uid++
    return { fieldId: `field-select-${uid}` }
  }
}
</script>
