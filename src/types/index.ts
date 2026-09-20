import 'vue-router'

// ─── Auth / User ───────────────────────────────────────────

export interface AuthToken {
  Value: string
}

export interface User {
  Id: number
  Name: string
  Email: string
}

export interface AuthResponse extends User {
  Token: AuthToken
}

// ─── Scheduling ────────────────────────────────────────────

/** Shared by every platform. */
export interface SchedulingParameters {
  ThemeTitle: string
  Description: string
  TargetAudience: string
  Style: string
  Goal: string
  CTA: string
  Language: string
  AdditionalInfo: string
  /** WordPress only. */
  SearchIntent?: string
  /** WordPress only. */
  Keywords?: string
  /** WordPress only. */
  ApproximatedSize?: string
  /** WordPress only. */
  SEOAdditionalInformation?: string
  /** Instagram only. */
  VisualHookInstructions?: string
  /** Instagram only. */
  CaptionInstructions?: string
  /** Instagram only. Comma-separated colors. */
  ColorPalette?: string
  /** Instagram only. */
  VisualLayout?: string
  /** Instagram only. */
  TextOnImage?: string
  /** Instagram only. 0 = short, 1 = medium, 2 = large. */
  CaptionSizeId?: number | null
  /** Instagram only. */
  HashtagsStrategy?: string
  /** Instagram only. */
  AvoidTopics?: string
  /** Instagram only. */
  ContentTone?: string
}

export const CAPTION_SIZE_SHORT = 0
export const CAPTION_SIZE_MEDIUM = 1
export const CAPTION_SIZE_LARGE = 2

export interface Scheduling {
  Id: number
  Interval: string
  ConvertedInterval: string
  Timezone: string
  Status: number
  ContentTypeId: number
  /** Instagram only. Flags the post as AI generated. */
  InstagramAIGeneratedLabel?: boolean
  /** Instagram only. Flags the post as a paid partnership. */
  InstagramPartnershipLabel?: boolean
  Parameters: SchedulingParameters
}

export interface SchedulingPayload {
  Interval: string
  Timezone: string
  ContentTypeId: number
  /** Instagram only; left out of the payload on every other platform. */
  InstagramAIGeneratedLabel?: boolean
  /** Instagram only; left out of the payload on every other platform. */
  InstagramPartnershipLabel?: boolean
  Parameters: SchedulingParameters
}

/** What SchedulingForm emits on submit. */
export interface SchedulingFormSubmit {
  interval: string
  timezone: string
  parameters: SchedulingParameters
  /** Only set once a platform lets the user pick it; otherwise the view defaults it. */
  contentTypeId?: number
  /** Instagram only; undefined on every other platform. */
  instagramAIGeneratedLabel?: boolean
  /** Instagram only; undefined on every other platform. */
  instagramPartnershipLabel?: boolean
}

// ─── Configuration ─────────────────────────────────────────

export interface Configuration {
  Id: number
  PlatformId: number
  PlatformName: string
  Url: string
  Username: string
  Password: string
  /** Handle of the linked Instagram account. Only present on Instagram configurations. */
  InstagramUsername?: string
  Schedulings: Scheduling[]
  RemainingRunsPerWeek: number
}

export interface ConfigurationCreatePayload {
  PlatformName: string
  PlatformId: number
  Url: string
  Username: string
  Password: string
  Schedulings: Scheduling[]
}

export interface ConfigurationUpdatePayload {
  PlatformName: string
  Url: string
  Username: string
  Password: string
}

/** Body of GET /api/configuration/instagram/start (200). */
export interface InstagramStartResponse {
  redirectUrl: string
  /** Same value, in case the API serializes with the PascalCase used elsewhere. */
  RedirectUrl?: string
}

// ─── Platforms ─────────────────────────────────────────────

export const PLATFORM_WORDPRESS = 1
export const PLATFORM_INSTAGRAM = 2

export const PLATFORM_LABELS: Record<number, string> = {
  [PLATFORM_WORDPRESS]: 'WordPress',
  [PLATFORM_INSTAGRAM]: 'Instagram'
}

// ─── Content types ─────────────────────────────────────────

export const CONTENT_TYPE_WORDPRESS = 1
export const CONTENT_TYPE_INSTAGRAM_SINGLE_POST = 2

/** Used when the platform does not let the user pick a content type. */
export const DEFAULT_CONTENT_TYPE_BY_PLATFORM: Record<number, number> = {
  [PLATFORM_WORDPRESS]: CONTENT_TYPE_WORDPRESS,
  [PLATFORM_INSTAGRAM]: CONTENT_TYPE_INSTAGRAM_SINGLE_POST
}

// ─── Subscription ─────────────────────────────────────────

export interface SubscriptionPlan {
  Id: number
  Name: string
  MaximumPosts: number
  MaximumConfigurations: number
  DefaultPrice: number
  PaymentLink: string | null
}

export interface UserSubscription {
  SubscriptionPlanId: number
  SubscriptionStatusId: number
}

// ─── Toast ─────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

// ─── UI ────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
}

// ─── Cron ──────────────────────────────────────────────────

export interface CronFields {
  minutes: string[]
  hours: string[]
  daysOfMonth: string[]
  months: string[]
  weekdays: string[]
}

// ─── Vue Router Meta ───────────────────────────────────────

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guest?: boolean
  }
}
