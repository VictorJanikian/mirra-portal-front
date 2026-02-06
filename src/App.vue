<template>
  <ToastContainer />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'

export default defineComponent({
  name: 'App',
  components: { ToastContainer }
})
</script>
