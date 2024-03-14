<script lang="ts" setup>
import { ref, } from 'vue'
import InitialForm from '@/components/InitialForm.vue'
import Tabbar from '@/components/Common/Tabbar.vue'
import router from '@/router'

const inititalFormed = ref(!!localStorage.getItem('inititalFormed'))

const onChangeTabbarItem = ({ index }: { index: number }) => {
  router.push(import.meta.env.BASE_URL + ['', 'chat'][index])
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <InitialForm v-if="!inititalFormed" @formed="inititalFormed = true" />
  <Tabbar @change="onChangeTabbarItem" />
</template>

<style scoped></style>