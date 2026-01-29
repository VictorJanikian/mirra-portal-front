<template>
  <div class="cron-preview">
    <em>{{ humanReadable }}</em>
  </div>
</template>

<script>
import { cronToHuman } from '@/utils/cronParser'

export default {
  name: 'CronPreview',
  props: {
    expression: { type: String, default: '* * * * *' }
  },
  computed: {
    humanReadable() {
      return cronToHuman(this.expression)
    }
  }
}
</script>

<style scoped>
.cron-preview {
  margin-top: 10px;
  padding: 10px;
  background: var(--color-primary-lighter);
  color: var(--color-primary-darkest);
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  font-size: var(--font-size-sm);
}
</style>
