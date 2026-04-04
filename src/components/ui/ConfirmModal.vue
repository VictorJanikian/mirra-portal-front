<template>
  <BaseModal :show="show" :title="title" @close="$emit('cancel')">
    <p>{{ message }}</p>
    <template #footer>
      <BaseButton variant="secondary" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton variant="danger" :loading="loading" @click="$emit('confirm')">{{ confirmLabel }}</BaseButton>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  name: 'ConfirmModal',
  components: { BaseModal, BaseButton },
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: 'Confirm' },
    message: { type: String, default: 'Are you sure?' },
    confirmLabel: { type: String, default: 'Remove' },
    loading: { type: Boolean, default: false }
  },
  emits: ['confirm', 'cancel']
})
</script>
