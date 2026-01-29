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

<script>
import SchedulingList from '@/components/scheduling/SchedulingList.vue'
import SchedulingForm from '@/components/scheduling/SchedulingForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useSchedulings } from '@/composables/useSchedulings'
import { useConfigurations } from '@/composables/useConfigurations'
import { useToast } from '@/composables/useToast'

export default {
  name: 'SchedulingFormView',
  components: { SchedulingList, SchedulingForm, BaseModal, BaseButton },
  props: {
    configId: { type: [String, Number], required: true },
    schedulingId: { type: [String, Number], default: null }
  },
  data() {
    return {
      schedulings: [],
      currentScheduling: null,
      currentSchedulingId: null,
      showForm: false,
      pageLoading: true,
      saving: false,
      deleting: false,
      showDeleteModal: false,
      schedulingToDelete: null,
      schedulingApi: null
    }
  },
  async created() {
    this.schedulingApi = useSchedulings(this.configId)
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.pageLoading = true
      try {
        await this.schedulingApi.fetchAll()
        this.schedulings = this.schedulingApi.schedulings.value

        if (this.schedulingId && this.schedulingId !== 'new') {
          const data = await this.schedulingApi.fetchOne(Number(this.schedulingId))
          if (data) {
            this.currentScheduling = data
            this.currentSchedulingId = data.Id
            this.showForm = true
          }
        } else if (this.schedulingId === 'new') {
          this.currentScheduling = null
          this.currentSchedulingId = null
          this.showForm = true
        }
      } finally {
        this.pageLoading = false
      }
    },

    onSelectScheduling(scheduling) {
      this.currentScheduling = scheduling
      this.currentSchedulingId = scheduling.Id
      this.showForm = true
      this.$router.replace({
        name: 'SchedulingEdit',
        params: { configId: this.configId, schedulingId: scheduling.Id }
      })
    },

    onCreateNew() {
      this.currentScheduling = null
      this.currentSchedulingId = null
      this.showForm = true
      this.$router.replace({
        name: 'SchedulingCreate',
        params: { configId: this.configId }
      })
    },

    async onSubmit(formData) {
      this.saving = true
      const { success, error } = useToast()
      try {
        const { cronExpression, ...parameters } = formData
        const payload = {
          Interval: cronExpression || '* * * * *',
          Parameters: parameters
        }

        if (this.currentSchedulingId) {
          const updated = await this.schedulingApi.update(this.currentSchedulingId, payload)
          this.currentScheduling = updated
          success('Agendamento atualizado com sucesso!')
        } else {
          const created = await this.schedulingApi.create(payload)
          this.currentScheduling = created
          this.currentSchedulingId = created.Id
          success('Agendamento criado com sucesso!')
        }

        this.schedulings = this.schedulingApi.schedulings.value
        await this.refreshConfigurations()
      } catch (e) {
        error(e.response?.data?.message || 'Erro ao salvar agendamento')
      } finally {
        this.saving = false
      }
    },

    onDeleteScheduling(scheduling) {
      this.schedulingToDelete = scheduling
      this.showDeleteModal = true
    },

    async confirmDelete() {
      if (!this.schedulingToDelete) return
      this.deleting = true
      const { success, error } = useToast()
      try {
        await this.schedulingApi.remove(this.schedulingToDelete.Id)
        this.schedulings = this.schedulingApi.schedulings.value
        success('Agendamento removido com sucesso!')

        if (this.currentSchedulingId === this.schedulingToDelete.Id) {
          this.currentScheduling = null
          this.currentSchedulingId = null
          this.showForm = false
        }

        this.showDeleteModal = false
        this.schedulingToDelete = null
        await this.refreshConfigurations()
      } catch (e) {
        error(e.response?.data?.message || 'Erro ao remover agendamento')
      } finally {
        this.deleting = false
      }
    },

    getCronFromForm() {
      // Fallback: get cron from CronBuilder v-model
      return '* * * * *'
    },

    async refreshConfigurations() {
      const { fetchAll } = useConfigurations()
      await fetchAll()
    }
  }
}
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
