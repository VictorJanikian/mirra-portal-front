<template>
  <div class="plan-view">
    <!-- Loading -->
    <div v-if="loading" class="plan-view__loading">
      <span class="spinner" style="color: var(--color-primary); width: 28px; height: 28px;"></span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="plan-view__error card">
      <p>{{ error }}</p>
      <button class="btn btn--primary btn--small mt-md" @click="loadData">Try again</button>
    </div>

    <!-- Plans grid -->
    <div v-else class="plan-view__grid">
      <div
        v-for="plan in sortedPlans"
        :key="plan.Id"
        class="plan-card"
        :class="{ 'plan-card--current': isCurrentPlan(plan.Id) }"
      >
        <!-- Badge -->
        <div v-if="isCurrentPlan(plan.Id)" class="plan-card__badge">Current plan</div>

        <!-- Header -->
        <div class="plan-card__header">
          <div class="plan-card__icon">
            <SvgIcon :name="plan.Price === 0 ? 'clock' : 'star'" :size="32" />
          </div>
          <h3 class="plan-card__name">{{ plan.Name }}</h3>
        </div>

        <!-- Price -->
        <div class="plan-card__price-section">
          <div class="plan-card__price">
            <template v-if="plan.Price === 0">
              <span class="plan-card__price-value">Free</span>
            </template>
            <template v-else>
              <span class="plan-card__price-currency">$</span>
              <span class="plan-card__price-value">{{ formatPriceInteger(plan.Price) }}</span>
              <span class="plan-card__price-cents">,{{ formatPriceCents(plan.Price) }}</span>
              <span class="plan-card__price-period">/month</span>
            </template>
          </div>
        </div>

        <!-- Divider -->
        <div class="plan-card__divider"></div>

        <!-- Features -->
        <ul class="plan-card__features">
          <li class="plan-card__feature">
            <SvgIcon name="check-circle" :size="18" />
            <span><strong>{{ plan.MaximumPosts }}</strong> weekly posts</span>
          </li>
          <li class="plan-card__feature">
            <SvgIcon name="check-circle" :size="18" />
            <span><strong>{{ plan.MaximumConfigurations }}</strong> {{ plan.MaximumConfigurations === 1 ? 'connected platform' : 'connected platforms' }}</span>
          </li>
        </ul>

        <!-- Payment flags (paid plans only) -->
        <div v-if="plan.Price > 0" class="plan-card__flags">
          <span class="plan-card__flags-label">Payment methods accepted:</span>
          <div class="plan-card__flags-row">
            <img class="plan-card__flag" :src="flagVisa" alt="Visa">
            <img class="plan-card__flag" :src="flagMastercard" alt="Mastercard">
            <img class="plan-card__flag" :src="flagAmex" alt="American Express">
            <img class="plan-card__flag" :src="flagElo" alt="Elo">
          </div>
        </div>

        <!-- Action button -->
        <button
          v-if="!isCurrentPlan(plan.Id)"
          class="btn btn--block plan-card__btn"
          :class="plan.Price > 0 ? 'btn--primary' : 'btn--secondary'"
          @click="handlePlanAction(plan)"
        >
          {{ isOnFreePlan ? 'Get Started' : 'Update plan' }}
          <SvgIcon name="arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSubscription } from '@/composables/useSubscription'
import type { SubscriptionPlan } from '@/types'
import SvgIcon from '@/components/ui/SvgIcon.vue'

import flagVisa from '@/assets/icons/flag-visa.svg'
import flagMastercard from '@/assets/icons/flag-mastercard.svg'
import flagAmex from '@/assets/icons/flag-amex.svg'
import flagElo from '@/assets/icons/flag-elo.svg'

export default defineComponent({
  name: 'ProfilePlanView',
  components: { SvgIcon },
  data() {
    return { flagVisa, flagMastercard, flagAmex, flagElo }
  },
  computed: {
    loading(): boolean {
      const { loading } = useSubscription()
      return loading.value
    },
    error(): string | null {
      const { error } = useSubscription()
      return error.value
    },
    sortedPlans(): SubscriptionPlan[] {
      const { sortedPlans } = useSubscription()
      return sortedPlans.value
    },
    isOnFreePlan(): boolean {
      const { isOnFreePlan } = useSubscription()
      return isOnFreePlan.value
    },
    stripePortalUrl(): string {
      return process.env.VUE_APP_STRIPE_CUSTOMER_PORTAL || ''
    }
  },
  methods: {
    isCurrentPlan(planId: number): boolean {
      const { userSubscription } = useSubscription()
      return userSubscription.value?.SubscriptionPlanId === planId
    },
    formatPriceInteger(cents: number): string {
      return Math.floor(cents / 100).toString()
    },
    formatPriceCents(cents: number): string {
      return (cents % 100).toString().padStart(2, '0')
    },
    handlePlanAction(plan: SubscriptionPlan): void {
      if (this.isOnFreePlan) {
        if (plan.PaymentLink) {
          window.open(plan.PaymentLink, '_blank', 'noopener')
        }
      } else {
        if (this.stripePortalUrl) {
          window.open(this.stripePortalUrl, '_blank', 'noopener')
        }
      }
    },
    loadData(): void {
      const { fetchAll } = useSubscription()
      fetchAll()
    }
  },
  mounted() {
    this.loadData()
  }
})
</script>

<style scoped>
.plan-view__loading {
  display: flex;
  justify-content: center;
  padding: var(--spacing-3xl);
}

.plan-view__error {
  text-align: center;
  color: var(--color-danger);
}

.plan-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1000px;
}

.plan-card {
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  min-height: 600px;
}

.plan-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.plan-card--current {
  border-color: var(--color-primary);
  border-width: 2px;
  background: linear-gradient(180deg, var(--color-primary-lighter) 0%, var(--color-white) 40%);
}

.plan-card--current:hover {
  transform: none;
}

.plan-card__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 4px 18px;
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.plan-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.plan-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-card--current .plan-card__icon {
  background: var(--color-primary);
  color: var(--color-white);
}

.plan-card__name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.plan-card__price-section {
  margin-bottom: var(--spacing-lg);
}

.plan-card__price {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.plan-card__price-currency {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
}

.plan-card__price-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-gray-900);
  line-height: 1;
}

.plan-card__price-cents {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  align-self: flex-start;
  margin-top: 4px;
}

.plan-card__price-period {
  font-size: var(--font-size-sm);
  font-weight: 400;
  color: var(--color-gray-500);
  margin-left: 4px;
}

.plan-card__divider {
  height: 1px;
  background: var(--border-color);
  margin-bottom: var(--spacing-lg);
}

.plan-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-lg) 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.plan-card__feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.plan-card__feature svg {
  color: var(--color-success);
  flex-shrink: 0;
}

.plan-card__feature strong {
  color: var(--color-gray-900);
}

.plan-card__flags {
  margin-bottom: var(--spacing-lg);
}

.plan-card__flags-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.plan-card__flags-row {
  display: flex;
  gap: var(--spacing-sm);
}

.plan-card__flag {
  width: 38px;
  height: 26px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.plan-card__btn {
  margin-top: auto;
  padding: 12px 22px;
  font-size: var(--font-size-base);
}
</style>
