<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const attraction: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
// 如果依赖用户登录（或匿名登录），则需要监听此事件
document.addEventListener('login', () => {
  db.collection('JAttraction').doc('65bdf3579beccb0820f313ad').get()
    .then(({ data }: { data: Attraction[] }) => {
      attraction.value = data[0]
      localStorage.setItem('attraction', JSON.stringify(attraction.value))
    })
})

</script>

<template>
  <div class="w-full h-full">
    <p>
      当前景区：{{ attraction?.name }}
    </p>
  </div>
</template>

<style></style>