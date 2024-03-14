<script lang="ts" setup>
import { ref, } from 'vue'
import InitialForm from '@/components/InitialForm.vue'

const inititalFormed = ref(!!localStorage.getItem('inititalFormed'))
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <InitialForm v-if="!inititalFormed" @formed="inititalFormed = true" />
</template>

<style scoped></style>