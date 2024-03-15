<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'
import Map from '@/components/Common/Map.vue'
import { useRoute } from 'vue-router'

// 景区ID，长河老街?attractionId=65bdf3579beccb0820f313ad
let id = localStorage.getItem('attractionId') as string
if (!id) {
  const { query, params } = useRoute()
  id = query.attractionId as string
  if (id) {
    localStorage.setItem('attractionId', id)
  } else {
    throw new Error('进入方式错误，请从官方渠道进入')
  }
}

const attraction: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
// 如果依赖用户登录（或匿名登录），则需要监听此事件
document.addEventListener('login', () => {
  db.collection('JAttraction').doc(id).get()
    .then(({ data }: { data: Attraction[] }) => {
      attraction.value = data[0]
      document.title = attraction.value.name
      localStorage.setItem('attraction', JSON.stringify(attraction.value))
    })
})

</script>

<template>
  <div class="home-container">
    <Map v-if="attraction" :attraction="attraction" />
  </div>
</template>

<style scoped>
.home-container {
  height: calc(100% - 4rem);
}
</style>