<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

const emit = defineEmits(['change'])

const currentIndex = ref(0)

function onClickTabbarItem(index: number) {
  currentIndex.value = index
  emit('change', { index })
}
</script>

<template>
  <div class="btm-nav">
    <button :class="{ active: currentIndex === 0 }" @click="onClickTabbarItem(0)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span class="btm-nav-label">导游</span>
    </button>
    <button :class="{ active: currentIndex === 1 }" @click="onClickTabbarItem(1)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="btm-nav-label">闲聊</span>
    </button>
  </div>
</template>

<style scoped>
.btm-nav {
  /* 1000在地图 */
  z-index: 1002;
}
</style>