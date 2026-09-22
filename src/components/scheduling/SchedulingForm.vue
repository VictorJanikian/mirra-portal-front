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
        label="Theme *"
        :tooltip="copy.theme.tooltip"
        :placeholder="copy.theme.placeholder"
      />

      <BaseTextarea
        v-model="formData.Description"
        label="Description"
        :tooltip="copy.description.tooltip"
        :placeholder="copy.description.placeholder"
        :rows="3"
      />

      <BaseInput
        v-if="isWordpress"
        v-model="formData.SearchIntent"
        label="Search Intent"
        tooltip="What the user expects to find when searching for the topic. Helps tailor the content to the expectations of those looking for information on Google."
        placeholder="E.g.: How to increase online sales"
      />

      <BaseInput
        v-if="isWordpress"
        v-model="formData.Keywords"
        label="Keywords"
        tooltip="Main SEO terms. The AI will use these words and their semantic variations to optimize the content for search engines."
        placeholder="E.g.: digital marketing, online sales, SEO"
      />

      <BaseInput
        v-model="formData.TargetAudience"
        label="Target Audience"
        :tooltip="copy.targetAudience.tooltip"
        :placeholder="copy.targetAudience.placeholder"
      />

      <BaseInput
        v-if="isWordpress"
        v-model="formData.Style"
        label="Style"
        tooltip="The tone and language style of the text. Examples: formal, irreverent, technical, academic, casual, etc."
        placeholder="E.g.: Informative and accessible"
      />

      <SuggestionTextarea
        v-else
        v-model="formData.Style"
        label="Style"
        tooltip="The overall visual, artistic and textual style of the posts. Pick one of the suggestions or describe your own."
        placeholder="Pick one of the options above or write your own..."
        :suggestions="STYLE_SUGGESTIONS"
        :maxlength="1500"
        :rows="3"
      />

      <SuggestionTextarea
        v-if="!isWordpress"
        v-model="formData.ContentTone"
        label="Content Tone"
        tooltip="The tone of voice of the posts. Pick one of the suggestions or describe your own."
        placeholder="Pick one of the options above or write your own..."
        :suggestions="CONTENT_TONE_SUGGESTIONS"
        :maxlength="1500"
        :rows="3"
      />

      <SuggestionTextarea
        v-if="!isWordpress"
        v-model="formData.VisualLayout"
        label="Visual Layout"
        tooltip="How the art is composed. Pick one of the suggestions or describe your own."
        placeholder="Pick one of the options above or write your own..."
        :suggestions="VISUAL_LAYOUT_SUGGESTIONS"
        :maxlength="1500"
        :rows="3"
      />

      <SuggestionTextarea
        v-if="!isWordpress"
        v-model="formData.TextOnImage"
        label="Text on Image"
        tooltip="How much text goes inside the art itself, and how it should look."
        placeholder="Pick one of the options above or write your own..."
        :suggestions="TEXT_ON_IMAGE_SUGGESTIONS"
        :maxlength="1500"
        :rows="3"
      />

      <BaseInput
        v-if="!isWordpress"
        v-model="formData.ColorPalette"
        label="Color Palette"
        tooltip="Colors the art should use, separated by commas."
        placeholder="E.g.: #0F172A, #38BDF8, Strong Red"
        :maxlength="256"
      />

      <BaseTextarea
        v-if="!isWordpress"
        v-model="formData.VisualHookInstructions"
        label="Visual Hook Instructions"
        tooltip="Instructions for the visual hook of the post image — what should catch the eye as someone scrolls."
        placeholder="Instructions for the visual hook of the image..."
        :maxlength="3000"
        :rows="3"
      />

      <BaseTextarea
        v-if="!isWordpress"
        v-model="formData.CaptionInstructions"
        label="Caption Instructions"
        tooltip="Specific instructions for the caption. It can tell an unrelated curiosity, expand on the message of the post, be a short persuasive piece, just a minimal impact phrase or whatever you decide."
        placeholder="Specific instructions for the caption..."
        :maxlength="3000"
        :rows="3"
      />

      <BaseSelect
        v-if="!isWordpress"
        v-model="captionSizeValue"
        label="Caption Size"
        tooltip="How long the caption should be."
        :options="CAPTION_SIZE_OPTIONS"
      />

      <BaseTextarea
        v-if="!isWordpress"
        v-model="formData.HashtagsStrategy"
        label="Hashtags Strategy"
        tooltip="Specific guidelines for building the hashtags of each post."
        placeholder="E.g.: mix 3 broad and 5 niche hashtags, never more than 10..."
        :maxlength="2000"
        :rows="3"
      />

      <BaseTextarea
        v-if="!isWordpress"
        v-model="formData.AvoidTopics"
        label="Topics to Avoid"
        tooltip="Specific topics the AI should stay away from when creating the posts."
        placeholder="Topics the AI should avoid..."
        :maxlength="3000"
        :rows="3"
      />

      <BaseInput
        v-model="formData.Goal"
        label="Goal"
        :tooltip="copy.goal.tooltip"
        :placeholder="copy.goal.placeholder"
      />

      <BaseInput
        v-model="formData.CTA"
        label="CTA (Call to Action)"
        :tooltip="copy.cta.tooltip"
        :placeholder="copy.cta.placeholder"
      />

      <BaseInput
        v-if="isWordpress"
        v-model="formData.ApproximatedSize"
        label="Approximate Size"
        tooltip="Approximate number of words in the generated text. The AI will try to get close to this number, accepting small natural variations."
        placeholder="E.g.: 1500"
      />

      <BaseInput
        v-model="formData.Language"
        label="Language"
        tooltip="The language in which the content will be generated. Use codes like en-US (American English) or pt-BR (Brazilian Portuguese)."
        placeholder="E.g.: en-US"
      />

      <BaseTextarea
        v-model="formData.AdditionalInfo"
        label="Additional Information"
        :tooltip="copy.additionalInfo.tooltip"
        :placeholder="copy.additionalInfo.placeholder"
        :rows="3"
      />

      <BaseTextarea
        v-if="isWordpress"
        v-model="formData.SEOAdditionalInformation"
        label="SEO"
        tooltip="Specific SEO instructions, such as optimized meta descriptions, image alt texts, or other search engine optimization guidelines."
        placeholder="Additional SEO instructions..."
        :rows="3"
      />

      <CronBuilder
        v-model="cronExpression"
        v-model:timezone="timezone"
      />

      <BaseToggle
        v-if="!isWordpress"
        v-model="instagramAIGeneratedLabel"
        label="Include AI generated label"
        tooltip="Turn this on only if you want the content labeled as &quot;created by Artificial Intelligence.&quot; - Instagram will then show the &quot;AI info&quot; badge. Note that it is not required under Meta's current policy for images - the type of content Mirra creates."
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
import BaseSelect from '@/components/ui/BaseSelect.vue'
import SuggestionTextarea from '@/components/ui/SuggestionTextarea.vue'
import BaseToggle from '@/components/ui/BaseToggle.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CronBuilder from './CronBuilder.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { detectUserTimezone } from '@/constants/timezones'
import {
  PLATFORM_WORDPRESS,
  CAPTION_SIZE_SHORT,
  CAPTION_SIZE_MEDIUM,
  CAPTION_SIZE_LARGE
} from '@/types'
import type { Scheduling, SchedulingParameters, SchedulingFormSubmit } from '@/types'

const STYLE_SUGGESTIONS = [
  'Minimalist',
  'Corporate',
  'Modern',
  'Premium',
  'Creative',
  'Illustrated'
]

const CONTENT_TONE_SUGGESTIONS = [
  'Educational',
  'Inspirational',
  'Professional',
  'Authority',
  'Casual',
  'Provocative',
  'Storytelling'
]

const VISUAL_LAYOUT_SUGGESTIONS = [
  'Text only',
  'Text over photo',
  'People',
  'Product',
  'Illustration / chart',
  'Abstract background'
]

const TEXT_ON_IMAGE_SUGGESTIONS = [
  'Large headline',
  'Headline + subtitle',
  'Short impact phrase',
  'No text'
]

const CAPTION_SIZE_OPTIONS = [
  { value: '', label: 'Not specified' },
  { value: String(CAPTION_SIZE_SHORT), label: 'Short' },
  { value: String(CAPTION_SIZE_MEDIUM), label: 'Medium' },
  { value: String(CAPTION_SIZE_LARGE), label: 'Large' }
]

/** Labels that differ between a blog post and a series of social posts. */
const COPY = {
  wordpress: {
    theme: {
      tooltip: 'The general blog theme. Defines the main subject the AI will generate content about.',
      placeholder: 'E.g.: Digital Marketing for Small Businesses'
    },
    description: {
      tooltip: 'The main editorial guide. It can represent a specific angle of the theme or the editorial direction to follow. It is the main compass for content generation.',
      placeholder: 'Describe the editorial focus of the content...'
    },
    targetAudience: {
      tooltip: 'Who the content is intended for. Defines the language, depth, and approach of the generated text.',
      placeholder: 'E.g.: Beginner entrepreneurs'
    },
    goal: {
      tooltip: 'What you want to achieve with the content. Examples: convert visitors into subscribers, educate the reader, generate engagement, etc.',
      placeholder: 'E.g.: Generate qualified leads'
    },
    cta: {
      tooltip: 'Optional call to action. If provided, it will be naturally integrated at the end of the text as a logical consequence of the argument, without excessive promotional language.',
      placeholder: 'E.g.: Subscribe to our newsletter'
    },
    additionalInfo: {
      tooltip: 'Extra context, conceptual definitions, or specific information the AI should consider when generating content.',
      placeholder: 'Extra information to guide content generation...'
    }
  },
  instagram: {
    theme: {
      tooltip: 'The general theme or concept behind this series of posts.',
      placeholder: 'E.g.: Healthy routines for busy people'
    },
    description: {
      tooltip: 'The main editorial guide for the series. It is the main compass the AI follows when creating each post.',
      placeholder: 'Describe the editorial focus of this series of posts...'
    },
    targetAudience: {
      tooltip: 'Who these posts are for. Defines the language, depth, and approach of the posts.',
      placeholder: 'E.g.: Women aged 25-40 interested in wellness'
    },
    goal: {
      tooltip: 'What this series of posts should achieve. Examples: engagement, saves, link in bio clicks, DMs, etc.',
      placeholder: 'E.g.: Increase saves and shares'
    },
    cta: {
      tooltip: 'Optional call to action to close the caption. It will be integrated naturally, without excessive promotional language.',
      placeholder: 'E.g.: Save this post for later'
    },
    additionalInfo: {
      tooltip: 'Extra context, conceptual definitions, or specific information the AI should consider when creating the posts.',
      placeholder: 'Extra information to guide post generation...'
    }
  }
}

/** Only the fields the platform actually renders are kept, so we never post stale WordPress SEO data. */
function buildFormData(
  params: Partial<SchedulingParameters> | undefined,
  isWordpress: boolean
): SchedulingParameters {
  const p = params || {}
  const shared: SchedulingParameters = {
    ThemeTitle: p.ThemeTitle || '',
    Description: p.Description || '',
    TargetAudience: p.TargetAudience || '',
    Style: p.Style || '',
    Goal: p.Goal || '',
    CTA: p.CTA || '',
    Language: p.Language || 'en-US',
    AdditionalInfo: p.AdditionalInfo || ''
  }

  if (isWordpress) {
    return {
      ...shared,
      SearchIntent: p.SearchIntent || '',
      Keywords: p.Keywords || '',
      ApproximatedSize: p.ApproximatedSize || '',
      SEOAdditionalInformation: p.SEOAdditionalInformation || ''
    }
  }

  return {
    ...shared,
    ContentTone: p.ContentTone || '',
    VisualLayout: p.VisualLayout || '',
    TextOnImage: p.TextOnImage || '',
    ColorPalette: p.ColorPalette || '',
    VisualHookInstructions: p.VisualHookInstructions || '',
    CaptionInstructions: p.CaptionInstructions || '',
    CaptionSizeId: p.CaptionSizeId ?? null,
    HashtagsStrategy: p.HashtagsStrategy || '',
    AvoidTopics: p.AvoidTopics || ''
  }
}

export default defineComponent({
  name: 'SchedulingForm',
  components: { BaseInput, BaseTextarea, BaseSelect, SuggestionTextarea, BaseToggle, BaseButton, CronBuilder, SvgIcon },
  props: {
    scheduling: { type: Object as PropType<Scheduling | null>, default: null },
    platformId: { type: Number, default: PLATFORM_WORDPRESS },
    loading: { type: Boolean, default: false }
  },
  emits: ['submit', 'delete'],
  data() {
    const initialTimezone = this.scheduling?.Timezone || detectUserTimezone()
    const initialCron = this.scheduling?.ConvertedInterval || '0 * * * *'
    return {
      STYLE_SUGGESTIONS,
      CONTENT_TONE_SUGGESTIONS,
      VISUAL_LAYOUT_SUGGESTIONS,
      TEXT_ON_IMAGE_SUGGESTIONS,
      CAPTION_SIZE_OPTIONS,
      formData: buildFormData(this.scheduling?.Parameters, this.platformId === PLATFORM_WORDPRESS),
      cronExpression: initialCron,
      timezone: initialTimezone,
      instagramAIGeneratedLabel: this.scheduling?.InstagramAIGeneratedLabel ?? false
    }
  },
  computed: {
    isWordpress(): boolean {
      return this.platformId === PLATFORM_WORDPRESS
    },
    copy(): typeof COPY.wordpress {
      return this.isWordpress ? COPY.wordpress : COPY.instagram
    },
    /** A <select> only speaks strings; CaptionSizeId stays an int everywhere else. */
    captionSizeValue: {
      get(): string {
        const id = this.formData.CaptionSizeId
        return id === null || id === undefined ? '' : String(id)
      },
      set(value: string): void {
        this.formData.CaptionSizeId = value === '' ? null : Number(value)
      }
    },
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
      const submit: SchedulingFormSubmit = {
        interval: this.cronExpression,
        timezone: this.timezone,
        parameters: this.formData
      }
      // WordPress has no such label, so it stays out of the payload entirely.
      if (!this.isWordpress) {
        submit.instagramAIGeneratedLabel = this.instagramAIGeneratedLabel
      }
      this.$emit('submit', submit)
    }
  },
  watch: {
    scheduling: {
      handler(val: Scheduling | null) {
        this.formData = buildFormData(val?.Parameters, this.isWordpress)
        this.cronExpression = val?.ConvertedInterval || '0 * * * *'
        this.timezone = val?.Timezone || detectUserTimezone()
        this.instagramAIGeneratedLabel = val?.InstagramAIGeneratedLabel ?? false
      },
      deep: true
    },
    platformId() {
      this.formData = buildFormData(this.formData, this.isWordpress)
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
