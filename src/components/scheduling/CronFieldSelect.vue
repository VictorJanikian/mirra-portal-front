<template>
  <div class="cron-field">
    <label class="cron-field__label">{{ label }}</label>
    <BaseMultiSelect
      v-if="multiple"
      :model-value="modelValue"
      :options="options"
      :wildcard-label="wildcardLabel"
      :show-unselected="showUnselected"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <select
      v-else
      :value="singleValue"
      @change="$emit('update:modelValue', [$event.target.value])"
      class="form-field__select"
    >
      <option
        v-for="opt in singleOptions"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import BaseMultiSelect from '@/components/ui/BaseMultiSelect.vue'
import type { SelectOption } from '@/types'

export default defineComponent({
  name: 'CronFieldSelect',
  components: { BaseMultiSelect },
  props: {
    label: { type: String, required: true },
    modelValue: { type: Array as PropType<string[]>, default: () => ['*'] },
    options: { type: Array as PropType<SelectOption[]>, required: true },
    wildcardLabel: { type: String, default: 'Todos' },
    multiple: { type: Boolean, default: true },
    showUnselected: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  computed: {
    singleValue(): string {
      return this.modelValue[0] || '*'
    },
    singleOptions(): SelectOption[] {
      return [{ value: '*', label: this.wildcardLabel }, ...this.options]
    }
  }
})
</script>

<style scoped>
.cron-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cron-field__label {
  font-weight: 500;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}
</style>
