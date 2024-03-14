<script lang="ts" setup>
import { ref, } from 'vue'
import InitialForm from '@/components/InitialForm.vue'
import Tabbar from '@/components/Common/Tabbar.vue'

const inititalFormed = ref(!!localStorage.getItem('inititalFormed'))

const onChangeTabbarItem = ({ index }: { index: number }) => {
  console.log(index)
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