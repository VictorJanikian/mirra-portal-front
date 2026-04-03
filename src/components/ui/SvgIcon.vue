<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icon.viewBox"
    fill="none"
    v-html="icon.content"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface IconDef {
  viewBox: string
  content: string
}

const icons: Record<string, IconDef> = {
  clock: {
    viewBox: '0 0 32 32',
    content: '<circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="1.5"/><path d="M16 8v8l5.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  star: {
    viewBox: '0 0 32 32',
    content: '<path d="M16 2L20.9 11.9L31.6 13.5L23.8 21.1L25.8 31.8L16 26.7L6.2 31.8L8.2 21.1L0.4 13.5L11.1 11.9L16 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'check-circle': {
    viewBox: '0 0 18 18',
    content: '<circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.15"/><path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-right': {
    viewBox: '0 0 16 16',
    content: '<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-up': {
    viewBox: '0 0 16 16',
    content: '<path d="M8 2L14 8H10V14H6V8H2L8 2Z" fill="currentColor"/>'
  },
  'external-link': {
    viewBox: '0 0 16 16',
    content: '<path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 1h6m0 0v6m0-6L8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  lock: {
    viewBox: '0 0 24 24',
    content: '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  trash: {
    viewBox: '0 0 24 24',
    content: '<polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  }
}

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 16 }
  },
  computed: {
    icon(): IconDef {
      return icons[this.name] || { viewBox: '0 0 16 16', content: '' }
    }
  }
})
</script>
