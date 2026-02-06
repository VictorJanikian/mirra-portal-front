<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn--${variant}`, { 'btn--block': block, 'btn--small': small }]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner" />
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    variant: { type: String, default: 'primary' },
    type: { type: String, default: 'button' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    small: { type: Boolean, default: false }
  },
  emits: ['click']
})
</script>
