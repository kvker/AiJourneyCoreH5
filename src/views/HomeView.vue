<script lang="ts" setup>
import { ref, } from 'vue'
import InitialForm from '@/components/InitialForm.vue'
import Tabbar from '@/components/Common/Tabbar.vue'
import router from '@/router'
import { useRoute } from 'vue-router'

// 景区ID，长河老街?attractionId=65bdf3579beccb0820f313ad
let id = ref(localStorage.getItem('attractionId') as string)
// console.log(id.value)
if (!id.value) {
  const { query, params } = useRoute()
  id.value = query.attractionId as string
  if (id.value) {
    localStorage.setItem('attractionId', id.value)
  } else {
    alert('进入方式错误，请从官方渠道进入')
    throw new Error('进入方式错误，请从官方渠道进入')
  }
}

const inititalFormed = ref(!!localStorage.getItem('inititalFormed'))

const onChangeTabbarItem = ({ index }: { index: number }) => {
  router.push(import.meta.env.BASE_URL + ['', 'chat'][index])
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive v-if="id">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <InitialForm v-if="id && !inititalFormed" @formed="inititalFormed = true" />
  <Tabbar @change="onChangeTabbarItem" />
</template>

<style scoped></style>