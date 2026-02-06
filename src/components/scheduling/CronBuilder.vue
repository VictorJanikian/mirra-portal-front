<template>
  <div class="cron-builder">
    <div class="cron-builder__header">
      <span class="cron-builder__title">Frequência de Publicação</span>
      <label class="cron-toggle">
        <span>Modo Avançado</span>
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
          label="Minutos"
          :model-value="fields.minutes"
          :options="minuteOptions"
          :multiple="false"
          wildcard-label="Todo minuto"
          @update:model-value="updateField('minutes', $event)"
        />
        <CronFieldSelect
          label="Horas"
          :model-value="fields.hours"
          :options="hourOptions"
          wildcard-label="Todas"
          @update:model-value="updateField('hours', $event)"
        />
        <CronFieldSelect
          label="Dias do mês"
          :model-value="fields.daysOfMonth"
          :options="dayOptions"
          wildcard-label="Todos"
          :show-unselected="true"
          @update:model-value="updateField('daysOfMonth', $event)"
        />
        <CronFieldSelect
          label="Meses"
          :model-value="fields.months"
          :options="monthOptions"
          wildcard-label="Todos"
          @update:model-value="updateField('months', $event)"
        />
        <CronFieldSelect
          label="Dias da semana"
          :model-value="fields.weekdays"
          :options="weekdayOptions"
          wildcard-label="Todos"
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
        Use 5 campos: minuto / hora / dia / mês / dia-da-semana (use ? para "não selecionado")
      </small>
    </div>

    <CronPreview :expression="computedExpression" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CronFieldSelect from './CronFieldSelect.vue'
import CronPreview from './CronPreview.vue'
import { parseCronField, buildCronField } from '@/utils/cronParser'
import type { CronFields, SelectOption } from '@/types'

export default defineComponent({
  name: 'CronBuilder',
  components: { CronFieldSelect, CronPreview },
  props: {
    modelValue: { type: String, default: '* * * * *' }
  },
  emits: ['update:modelValue'],
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
      const min = buildCronField(this.fields.minutes)
      const hour = buildCronField(this.fields.hours)
      const dom = buildCronField(this.fields.daysOfMonth)
      const month = buildCronField(this.fields.months)
      const dow = buildCronField(this.fields.weekdays)
      return `${min} ${hour} ${dom} ${month} ${dow}`
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
      const names: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      return names.map((name, i) => ({ value: String(i + 1), label: name }))
    },
    weekdayOptions(): SelectOption[] {
      return [
        { value: '0', label: 'Domingo' },
        { value: '1', label: 'Segunda' },
        { value: '2', label: 'Terça' },
        { value: '3', label: 'Quarta' },
        { value: '4', label: 'Quinta' },
        { value: '5', label: 'Sexta' },
        { value: '6', label: 'Sábado' }
      ]
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
    updateField(field: keyof CronFields, value: string[]) {
      this.fields[field] = value
    },
    onRawInput() {
      // Raw expression is already v-modeled
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
