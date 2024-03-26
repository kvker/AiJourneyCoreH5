<script lang="ts" setup>
import { ref, } from 'vue'
import type { Ref } from 'vue'
import InitialForm from '@/components/InitialForm.vue'
import Tabbar from '@/components/Common/Tabbar.vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { db } from '@/services/cloud'

// 景区ID，长河老街?attractionId=65bdf3579beccb0820f313ad
let idRef = ref(localStorage.getItem('attractionId') as string)
// console.log(idRef.value)
if (!idRef.value) {
  const { query, params } = useRoute()
  idRef.value = query.attractionId as string
  if (idRef.value) {
    localStorage.setItem('attractionId', idRef.value)
  } else {
    alert('进入方式错误，请从官方渠道进入')
    throw new Error('进入方式错误，请从官方渠道进入')
  }
}

const attractionRef: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
// 如果依赖用户登录（或匿名登录），则需要监听此事件
document.addEventListener('login', () => {
  db.collection('JAttraction').doc(idRef.value).get()
    .then(({ data }: { data: Attraction[] }) => {
      attractionRef.value = data[0]
      document.title = attractionRef.value.name
      localStorage.setItem('attraction', JSON.stringify(attractionRef.value))
    })
})

const inititalFormed = ref(!!localStorage.getItem('inititalFormed'))
const removeInitialForm = ref(inititalFormed.value)

const onChangeTabbarItem = ({ index }: { index: number }) => {
  router.push(import.meta.env.BASE_URL + ['', 'chat'][index])
}

function onFormed() {
  inititalFormed.value = true
  setTimeout(() => {
    removeInitialForm.value = true
  }, 3000)
}
</script>

<template>
  <template v-if="idRef && attractionRef">
    <router-view v-if="inititalFormed" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <InitialForm v-if="!removeInitialForm" @formed="onFormed" />
  </template>
  <Tabbar v-if="inititalFormed" @change="onChangeTabbarItem" />
</template>

<style scoped></style>