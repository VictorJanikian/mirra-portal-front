<template>
  <div class="scheduling-form fade-in">
    <div class="scheduling-form__title-row">
      <h2 class="scheduling-form__title">{{ isEditing ? 'Edit Schedule' : 'New Schedule' }}</h2>
      <span
        v-if="isEditing && scheduling && scheduling.Status !== 2"
        class="scheduling-form__status"
        :class="scheduling.Status === 0 ? 'scheduling-form__status--active' : 'scheduling-form__status--inactive'"
      >
        {{ statusLabel }}
      </span>
      <button
        v-if="isEditing"
        class="scheduling-form__delete"
        type="button"
        title="Delete schedule"
        @click="$emit('delete', scheduling)"
      >
        <SvgIcon name="trash" :size="18" />
      </button>
    </div>

    <div v-if="isEditing && scheduling && scheduling.Status === 2" class="scheduling-form__banner">
      Suspended due to plan downgrade.
      <br>
      <router-link :to="{ name: 'ProfilePlan' }" class="scheduling-form__banner-link">Upgrade your plan</router-link>
      or reduce the number of weekly posts for this connection.
    </div>

    <form @submit.prevent="handleSubmit" class="scheduling-form__fields">
      <BaseInput
        v-model="formData.ThemeTitle"
        label="Theme Title *"
        tooltip="The general blog theme. Defines the main subject the AI will generate content about."
        placeholder="E.g.: Digital Marketing for Small Businesses"
      />

      <BaseTextarea
        v-model="formData.Description"
        label="Description"
        tooltip="The main editorial guide. It can represent a specific angle of the theme or the editorial direction to follow. It is the main compass for content generation."
        placeholder="Describe the editorial focus of the content..."
        :rows="3"
      />

      <BaseInput
        v-model="formData.SearchIntent"
        label="Search Intent"
        tooltip="What the user expects to find when searching for the topic. Helps tailor the content to the expectations of those looking for information on Google."
        placeholder="E.g.: How to increase online sales"
      />

      <BaseInput
        v-model="formData.Keywords"
        label="Keywords"
        tooltip="Main SEO terms. The AI will use these words and their semantic variations to optimize the content for search engines."
        placeholder="E.g.: digital marketing, online sales, SEO"
      />

      <BaseInput
        v-model="formData.TargetAudience"
        label="Target Audience"
        tooltip="Who the content is intended for. Defines the language, depth, and approach of the generated text."
        placeholder="E.g.: Beginner entrepreneurs"
      />

      <BaseInput
        v-model="formData.Style"
        label="Style"
        tooltip="The tone and language style of the text. Examples: formal, irreverent, technical, academic, casual, etc."
        placeholder="E.g.: Informative and accessible"
      />

      <BaseInput
        v-model="formData.Goal"
        label="Goal"
        tooltip="What you want to achieve with the content. Examples: convert visitors into subscribers, educate the reader, generate engagement, etc."
        placeholder="E.g.: Generate qualified leads"
      />

      <BaseInput
        v-model="formData.CTA"
        label="CTA (Call to Action)"
        tooltip="Optional call to action. If provided, it will be naturally integrated at the end of the text as a logical consequence of the argument, without excessive promotional language."
        placeholder="E.g.: Subscribe to our newsletter"
      />

      <BaseInput
        v-model="formData.ApproximatedSize"
        label="Approximate Size"
        tooltip="Approximate number of words in the generated text. The AI will try to get close to this number, accepting small natural variations."
        placeholder="E.g.: 1500"
      />

      <BaseTextarea
        v-model="formData.AdditionalInfo"
        label="Additional Information"
        tooltip="Extra context, conceptual definitions, or specific information the AI should consider when generating content."
        placeholder="Extra information to guide content generation..."
        :rows="3"
      />

      <BaseTextarea
        v-model="formData.SEOAdditionalInformation"
        label="SEO"
        tooltip="Specific SEO instructions, such as optimized meta descriptions, image alt texts, or other search engine optimization guidelines."
        placeholder="Additional SEO instructions..."
        :rows="3"
      />

      <BaseInput
        v-model="formData.Language"
        label="Language"
        tooltip="The language in which the content will be generated. Use codes like en-US (American English) or pt-BR (Brazilian Portuguese)."
        placeholder="E.g.: en-US"
      />

      <CronBuilder
        v-model="cronExpression"
        v-model:timezone="timezone"
      />

      <div class="scheduling-form__actions">
        <BaseButton type="submit" :loading="loading">
          Save
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CronBuilder from './CronBuilder.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { detectUserTimezone } from '@/constants/timezones'
import type { Scheduling, SchedulingParameters } from '@/types'

export default defineComponent({
  name: 'SchedulingForm',
  components: { BaseInput, BaseTextarea, BaseButton, CronBuilder, SvgIcon },
  props: {
    scheduling: { type: Object as PropType<Scheduling | null>, default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ['submit', 'delete'],
  data() {
    const params: Partial<SchedulingParameters> = this.scheduling?.Parameters || {}
    const initialTimezone = this.scheduling?.Timezone || detectUserTimezone()
    const initialCron = this.scheduling?.ConvertedInterval || '0 * * * *'
    return {
      formData: {
        ThemeTitle: params.ThemeTitle || '',
        Description: params.Description || '',
        SearchIntent: params.SearchIntent || '',
        Keywords: params.Keywords || '',
        TargetAudience: params.TargetAudience || '',
        Style: params.Style || '',
        Goal: params.Goal || '',
        CTA: params.CTA || '',
        ApproximatedSize: params.ApproximatedSize || '',
        AdditionalInfo: params.AdditionalInfo || '',
        SEOAdditionalInformation: params.SEOAdditionalInformation || '',
        Language: params.Language || 'en-US'
      } as SchedulingParameters,
      cronExpression: initialCron,
      timezone: initialTimezone
    }
  },
  computed: {
    isEditing(): boolean {
      return !!this.scheduling?.Id
    },
    statusLabel(): string {
      const status = this.scheduling?.Status
      if (status === 0) return 'Active'
      if (status === 1) return 'Inactive due to missing payment'
      if (status === 3) return 'Canceled'
      return 'Inactive'
    }
  },
  methods: {
    handleSubmit(): void {
      this.$emit('submit', {
        ...this.formData,
        cronExpression: this.cronExpression,
        timezone: this.timezone
      })
    }
  },
  watch: {
    scheduling: {
      handler(val: Scheduling | null) {
        if (val) {
          const params: Partial<SchedulingParameters> = val.Parameters || {}
          this.formData = {
            ThemeTitle: params.ThemeTitle || '',
            Description: params.Description || '',
            SearchIntent: params.SearchIntent || '',
            Keywords: params.Keywords || '',
            TargetAudience: params.TargetAudience || '',
            Style: params.Style || '',
            Goal: params.Goal || '',
            CTA: params.CTA || '',
            ApproximatedSize: params.ApproximatedSize || '',
            AdditionalInfo: params.AdditionalInfo || '',
            SEOAdditionalInformation: params.SEOAdditionalInformation || '',
            Language: params.Language || 'en-US'
          } as SchedulingParameters
          this.cronExpression = val.ConvertedInterval || '0 * * * *'
          this.timezone = val.Timezone || detectUserTimezone()
        } else {
          this.formData = {
            ThemeTitle: '',
            Description: '',
            SearchIntent: '',
            Keywords: '',
            TargetAudience: '',
            Style: '',
            Goal: '',
            CTA: '',
            ApproximatedSize: '',
            AdditionalInfo: '',
            SEOAdditionalInformation: '',
            Language: 'en-US'
          } as SchedulingParameters
          this.cronExpression = '0 * * * *'
          this.timezone = detectUserTimezone()
        }
      },
      deep: true
    }
  }
})
</script>

<style scoped>
.scheduling-form {
  flex: 1;
  padding-left: 32px;
  min-width: 0;
}

.scheduling-form__title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.scheduling-form__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.scheduling-form__status {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.scheduling-form__status--active {
  color: #15803d;
  background: #f0fdf4;
}

.scheduling-form__status--inactive {
  color: #b91c1c;
  background: #fef2f2;
  font-size: small;
}

.scheduling-form__delete {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.scheduling-form__delete:hover {
  color: #dc2626;
  background: #fef2f2;
}

.scheduling-form__banner {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: var(--border-radius, 8px);
  padding: 12px 16px;
  font-size: var(--font-size-sm, 14px);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg, 16px);
  max-width: 800px;
}

.scheduling-form__banner-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.scheduling-form__fields {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.scheduling-form__actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-sm);
}

@media (max-width: 992px) {
  .scheduling-form {
    padding-left: 0;
    margin-top: var(--spacing-lg);
  }
}
</style>
