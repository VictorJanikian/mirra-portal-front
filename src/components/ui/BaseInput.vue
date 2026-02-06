<template>
  <div class="form-field">
    <label v-if="label" :for="fieldId" class="form-field__label">
      {{ label }}
      <BaseTooltip v-if="tooltip" :text="tooltip" />
    </label>
    <input
      :id="fieldId"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      class="form-field__input"
      :class="{ 'form-field__input--error': error }"
    />
    <span v-if="error" class="form-field__error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseTooltip from './BaseTooltip.vue'

let uid = 0

export default defineComponent({
  name: 'BaseInput',
  components: { BaseTooltip },
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    maxlength: { type: [String, Number], default: null }
  },
  emits: ['update:modelValue'],
  setup() {
    uid++
    return { fieldId: `field-input-${uid}` }
  }
})
</script>
