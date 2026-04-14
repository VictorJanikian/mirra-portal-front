<template>
  <div class="cron-builder">
    <div class="cron-builder__header">
      <span class="cron-builder__title">Publishing Frequency</span>
      <label class="cron-toggle">
        <span>Advanced Mode</span>
        <span class="switch">
          <input type="checkbox" v-model="advancedMode" />
          <span class="slider" />
        </span>
      </label>
    </div>

    <!-- Simple Mode -->
    <div v-if="!advancedMode" class="cron-builder__simple">
      <div class="cron-grid">
        <CronFieldSelect
          label="Minutes"
          :model-value="fields.minutes"
          :options="minuteOptions"
          :multiple="false"
          wildcard-label="Every minute"
          @update:model-value="updateField('minutes', $event)"
        />
        <CronFieldSelect
          label="Hours"
          :model-value="fields.hours"
          :options="hourOptions"
          wildcard-label="All"
          @update:model-value="updateField('hours', $event)"
        />
        <CronFieldSelect
          label="Days of month"
          :model-value="fields.daysOfMonth"
          :options="dayOptions"
          wildcard-label="All"
          :show-unselected="true"
          @update:model-value="updateField('daysOfMonth', $event)"
        />
        <CronFieldSelect
          label="Months"
          :model-value="fields.months"
          :options="monthOptions"
          wildcard-label="All"
          @update:model-value="updateField('months', $event)"
        />
        <CronFieldSelect
          label="Weekdays"
          :model-value="fields.weekdays"
          :options="weekdayOptions"
          wildcard-label="All"
          :show-unselected="true"
          @update:model-value="updateField('weekdays', $event)"
        />
      </div>
    </div>

    <!-- Advanced Mode -->
    <div v-else class="cron-builder__advanced">
      <input
        v-model="rawExpression"
        type="text"
        class="form-field__input cron-raw-input"
        maxlength="30"
        placeholder="* * * * *"
        @input="onRawInput"
      />
      <small class="cron-builder__help">
        Use 5 fields: minute / hour / day / month / weekday (use ? for "not selected")
      </small>
    </div>

    <CronPreview :expression="computedExpression" />

    <div class="cron-builder__timezone">
      <label class="cron-builder__timezone-label" for="cron-timezone-select">Timezone</label>
      <select
        id="cron-timezone-select"
        class="form-field__select cron-builder__timezone-select"
        :value="timezone"
        @change="onTimezoneChange($event)"
      >
        <option v-for="tz in timezoneOptions" :key="tz" :value="tz">{{ tz }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CronFieldSelect from './CronFieldSelect.vue'
import CronPreview from './CronPreview.vue'
import { parseCronField, buildCronField } from '@/utils/cronParser'
import { TIMEZONES } from '@/constants/timezones'
import type { CronFields, SelectOption } from '@/types'

export default defineComponent({
  name: 'CronBuilder',
  components: { CronFieldSelect, CronPreview },
  props: {
    modelValue: { type: String, default: '* * * * *' },
    timezone: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'update:timezone'],
  data() {
    return {
      advancedMode: false,
      rawExpression: this.modelValue || '* * * * *',
      fields: this.parseExpression(this.modelValue || '* * * * *') as CronFields
    }
  },
  computed: {
    computedExpression(): string {
      if (this.advancedMode) return this.rawExpression
      return this.buildFromFields()
    },
    minuteOptions(): SelectOption[] {
      return [
        { value: '0', label: '00' },
        { value: '15', label: '15' },
        { value: '30', label: '30' },
        { value: '45', label: '45' }
      ]
    },
    hourOptions(): SelectOption[] {
      const opts: SelectOption[] = []
      for (let h = 0; h < 24; h++) {
        opts.push({ value: String(h), label: `${String(h).padStart(2, '0')}h` })
      }
      return opts
    },
    dayOptions(): SelectOption[] {
      const opts: SelectOption[] = []
      for (let d = 1; d <= 31; d++) {
        opts.push({ value: String(d), label: String(d) })
      }
      return opts
    },
    monthOptions(): SelectOption[] {
      const names: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      return names.map((name, i) => ({ value: String(i + 1), label: name }))
    },
    weekdayOptions(): SelectOption[] {
      return [
        { value: '0', label: 'Sunday' },
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' }
      ]
    },
    timezoneOptions(): string[] {
      return TIMEZONES
    }
  },
  watch: {
    computedExpression(val: string) {
      this.$emit('update:modelValue', val)
    },
    modelValue(val: string) {
      if (val !== this.computedExpression) {
        this.rawExpression = val
        this.fields = this.parseExpression(val)
      }
    }
  },
  methods: {
    parseExpression(expr: string): CronFields {
      if (!expr) return { minutes: ['*'], hours: ['*'], daysOfMonth: ['*'], months: ['*'], weekdays: ['*'] }
      const parts = expr.trim().split(/\s+/)
      return {
        minutes: parseCronField(parts[0] || '*'),
        hours: parseCronField(parts[1] || '*'),
        daysOfMonth: parseCronField(parts[2] || '*'),
        months: parseCronField(parts[3] || '*'),
        weekdays: parseCronField(parts[4] || '*')
      }
    },
    buildFromFields(): string {
      const min = buildCronField(this.fields.minutes)
      const hour = buildCronField(this.fields.hours)
      const dom = buildCronField(this.fields.daysOfMonth)
      const month = buildCronField(this.fields.months)
      const dow = buildCronField(this.fields.weekdays)
      return `${min} ${hour} ${dom} ${month} ${dow}`
    },
    updateField(field: keyof CronFields, value: string[]) {
      this.fields[field] = value
      // Keep rawExpression in sync so toggling to advanced mode shows the latest edits
      this.rawExpression = this.buildFromFields()
    },
    onRawInput() {
      // Keep fields in sync so toggling to simple mode reflects the latest raw expression
      this.fields = this.parseExpression(this.rawExpression)
    },
    onTimezoneChange(ev: Event) {
      const target = ev.target as HTMLSelectElement
      this.$emit('update:timezone', target.value)
    }
  }
})
</script>

<style scoped>
.cron-builder {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  background: var(--color-gray-50);
}

.cron-builder__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.cron-builder__title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.cron-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  cursor: pointer;
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--border-input);
  transition: var(--transition-slow);
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition-slow);
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #4f46e5;
}

.switch input:checked + .slider:before {
  transform: translateX(16px);
}

.cron-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.cron-builder__timezone {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.cron-builder__timezone-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  font-weight: 500;
  white-space: nowrap;
}

.cron-builder__timezone-select {
  flex: 1;
  min-width: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%236b7280' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 12px 8px;
  padding-right: 38px;
  cursor: pointer;
}

.cron-builder__advanced {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cron-raw-input {
  font-family: monospace;
  font-size: var(--font-size-lg);
  letter-spacing: 2px;
}

.cron-builder__help {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin-left: 2px;
}
</style>
