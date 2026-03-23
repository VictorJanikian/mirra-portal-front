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

export interface SchedulingParameters {
  ThemeTitle: string
  Description: string
  SearchIntent: string
  Keywords: string
  TargetAudience: string
  Style: string
  Goal: string
  CTA: string
  ApproximatedSize: string
  AdditionalInfo: string
  SEOAdditionalInformation: string
  Language: string
}

export interface Scheduling {
  Id: number
  Interval: string
  Status: number
  Parameters: SchedulingParameters
}

export interface SchedulingPayload {
  Interval: string
  Parameters: SchedulingParameters
}

// ─── Configuration ─────────────────────────────────────────

export interface Configuration {
  Id: number
  PlatformId: number
  PlatformName: string
  Url: string
  Username: string
  Password: string
  Schedulings: Scheduling[]
  RemainingRunsPerWeek: number
}

export interface ConfigurationCreatePayload {
  PlatformId: number
  Url: string
  Username: string
  Password: string
}

// ─── Subscription ─────────────────────────────────────────

export interface SubscriptionPlan {
  Id: number
  Name: string
  MaximumPosts: number
  MaximumConfigurations: number
  Price: number
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
