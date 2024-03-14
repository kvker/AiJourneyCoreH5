<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'
import Map from '@/components/Common/Map.vue'

const attraction: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
// 如果依赖用户登录（或匿名登录），则需要监听此事件
document.addEventListener('login', () => {
  db.collection('JAttraction').doc('65bdf3579beccb0820f313ad').get()
    .then(({ data }: { data: Attraction[] }) => {
      attraction.value = data[0]
      document.title = attraction.value.name
      localStorage.setItem('attraction', JSON.stringify(attraction.value))
    })
})

// TODO 测试用
function clean() {
  localStorage.removeItem('inititalForm')
  localStorage.removeItem('inititalFormed')
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref({ lng: 116.397428, lat: 39.90923 })
function onChooseLnglat(lnglat: Lnglat) {
  console.log(lnglat)
}
</script>

<template>
  <div class="home-container">
    <Map :visible="dialogMapVisible" :defaultLnglat="defaultLnglat" @choose="onChooseLnglat" />
  </div>
</template>

<style scoped>
.home-container {
  height: calc(100% - 4rem);
}
</style>