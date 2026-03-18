<template>
  <div class="payments-view">
    <div class="card">
      <h2 class="payments-view__title">Pagamentos</h2>
      <p class="payments-view__description">
        Gerencie suas faturas, métodos de pagamento e histórico de pagamentos no portal de pagamentos.
      </p>
      <button
        class="btn btn--primary"
        :disabled="!stripePortalUrl"
        @click="openPaymentPortal"
      >
        <SvgIcon name="external-link" />
        Gerenciar pagamentos
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'

export default defineComponent({
  name: 'ProfilePaymentsView',
  components: { SvgIcon },
  computed: {
    stripePortalUrl(): string {
      return process.env.VUE_APP_STRIPE_CUSTOMER_PORTAL || ''
    }
  },
  methods: {
    openPaymentPortal(): void {
      if (this.stripePortalUrl) {
        window.open(this.stripePortalUrl, '_blank', 'noopener')
      }
    }
  }
})
</script>

<style scoped>
.payments-view__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-md);
}

.payments-view__description {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}
</style>
