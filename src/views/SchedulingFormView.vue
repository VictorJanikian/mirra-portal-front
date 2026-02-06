<template>
  <div class="scheduling-view">
    <div v-if="pageLoading" class="scheduling-view__loading">
      <span class="spinner" style="border-color: rgba(37,99,235,0.2); border-top-color: #2563eb;" />
      <span>Carregando...</span>
    </div>

    <div v-else class="scheduling-view__container card">
      <SchedulingList
        :schedulings="schedulings"
        :active-id="currentSchedulingId"
        @select="onSelectScheduling"
        @create="onCreateNew"
        @delete="onDeleteScheduling"
      />

      <SchedulingForm
        v-if="showForm"
        :key="currentSchedulingId ?? 'new'"
        :scheduling="currentScheduling"
        :loading="saving"
        @submit="onSubmit"
      />

      <div v-else class="scheduling-view__empty">
        <p>Selecione um agendamento à esquerda ou crie um novo.</p>
      </div>
    </div>

    <!-- Delete confirmation -->
    <BaseModal
      :show="showDeleteModal"
      title="Confirmar Exclusão"
      @close="showDeleteModal = false"
    >
      <p>Deseja realmente remover este agendamento?</p>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">Cancelar</BaseButton>
        <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">Remover</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import SchedulingList from '@/components/scheduling/SchedulingList.vue'
import SchedulingForm from '@/components/scheduling/SchedulingForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useSchedulings } from '@/composables/useSchedulings'
import { useConfigurations } from '@/composables/useConfigurations'
import { useToast } from '@/composables/useToast'
import type { Scheduling, SchedulingPayload } from '@/types'

export default defineComponent({
  name: 'SchedulingFormView',
  components: { SchedulingList, SchedulingForm, BaseModal, BaseButton },
  props: {
    configId: { type: [String, Number] as PropType<string | number>, required: true },
    schedulingId: { type: [String, Number] as PropType<string | number>, default: null }
  },
  data() {
    return {
      schedulings: [] as Scheduling[],
      currentScheduling: null as Scheduling | null,
      currentSchedulingId: null as number | null,
      showForm: false,
      pageLoading: true,
      saving: false,
      deleting: false,
      showDeleteModal: false,
      schedulingToDelete: null as Scheduling | null,
      schedulingApi: null as unknown
    }
  },
  computed: {
    api(): ReturnType<typeof useSchedulings> {
      return this.schedulingApi as unknown as ReturnType<typeof useSchedulings>
    }
  },
  watch: {
    schedulingId(): void {
      this.loadData()
    }
  },
  async created() {
    this.schedulingApi = useSchedulings(this.configId)
    await this.loadData()
  },
  methods: {
    async loadData(): Promise<void> {
      this.pageLoading = true
      try {
        await this.api.fetchAll()
        this.schedulings = this.api.schedulings.value

        if (this.schedulingId && this.schedulingId !== 'new') {
          const data = await this.api.fetchOne(Number(this.schedulingId))
          if (data) {
            this.currentScheduling = data
            this.currentSchedulingId = data.Id
            this.showForm = true
          }
        } else {
          this.currentScheduling = null
          this.currentSchedulingId = null
          this.showForm = true
        }
      } finally {
        this.pageLoading = false
      }
    },

    onSelectScheduling(scheduling: Scheduling): void {
      this.currentScheduling = scheduling
      this.currentSchedulingId = scheduling.Id
      this.showForm = true
      this.$router.replace({
        name: 'SchedulingEdit',
        params: { configId: String(this.configId), schedulingId: String(scheduling.Id) }
      })
    },

    onCreateNew(): void {
      this.currentScheduling = null
      this.currentSchedulingId = null
      this.showForm = true
      this.$router.replace({
        name: 'SchedulingCreate',
        params: { configId: String(this.configId) }
      })
    },

    async onSubmit(formData: Record<string, unknown>): Promise<void> {
      this.saving = true
      const { success, error } = useToast()
      try {
        const { cronExpression, ...parameters } = formData
        const payload: SchedulingPayload = {
          Interval: (cronExpression as string) || '* * * * *',
          Parameters: parameters as unknown as SchedulingPayload['Parameters']
        }

        if (this.currentSchedulingId) {
          const updated = await this.api.update(this.currentSchedulingId, payload)
          this.currentScheduling = updated
          success('Agendamento atualizado com sucesso!')
        } else {
          const created = await this.api.create(payload)
          this.currentScheduling = created
          this.currentSchedulingId = created.Id
          success('Agendamento criado com sucesso!')
        }

        this.schedulings = this.api.schedulings.value
        await this.refreshConfigurations()
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        error(err.response?.data?.message || 'Erro ao salvar agendamento')
      } finally {
        this.saving = false
      }
    },

    onDeleteScheduling(scheduling: Scheduling): void {
      this.schedulingToDelete = scheduling
      this.showDeleteModal = true
    },

    async confirmDelete(): Promise<void> {
      if (!this.schedulingToDelete) return
      this.deleting = true
      const { success, error } = useToast()
      try {
        await this.api.remove(this.schedulingToDelete.Id)
        this.schedulings = this.api.schedulings.value
        success('Agendamento removido com sucesso!')

        if (this.currentSchedulingId === this.schedulingToDelete.Id) {
          this.currentScheduling = null
          this.currentSchedulingId = null
          this.showForm = false
        }

        this.showDeleteModal = false
        this.schedulingToDelete = null
        await this.refreshConfigurations()
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        error(err.response?.data?.message || 'Erro ao remover agendamento')
      } finally {
        this.deleting = false
      }
    },

    getCronFromForm(): string {
      // Fallback: get cron from CronBuilder v-model
      return '* * * * *'
    },

    async refreshConfigurations(): Promise<void> {
      const { fetchAll } = useConfigurations()
      await fetchAll()
    }
  }
})
</script>

<style scoped>
.scheduling-view__loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
  padding: var(--spacing-3xl);
  color: var(--color-gray-500);
}

.scheduling-view__container {
  display: flex;
  gap: 40px;
  min-height: calc(100vh - 160px);
  padding: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: visible;
}

.scheduling-view__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
}

@media (max-width: 992px) {
  .scheduling-view__container {
    flex-direction: column;
    padding: var(--spacing-lg);
  }
}
</style>
