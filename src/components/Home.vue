<script lang="ts" setup>
import { ref } from 'vue'
import Map from '@/components/Common/Map.vue'

const attractionRef = ref(JSON.parse(localStorage.getItem('attraction') as string))
</script>

<template>
  <div class="home-container">
    <Map :attraction="attractionRef" />
  </div>
</template>

<style scoped>
.home-container {
  height: calc(100% - 4rem);
}
</style>