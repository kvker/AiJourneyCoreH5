<script lang="ts" setup>
import { ref, } from 'vue'
import router from '@/router'
import Tabbar from '@/components/Common/Tabbar.vue'
import { auth } from '@/services/cloud'

if (!auth.currentUser) {
  alert('未登录, 非法进入')
  router.replace('/')
}

function onChangeTabbarItem({ index }: { index: number }) {
  router.push(['/home', '/home/chat', '/home/mine'][index])
}
</script>

<template>
  <main class=" main-container h-full">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
  <!-- <Tabbar @change="onChangeTabbarItem" /> -->
</template>

<style>
/* 表格的底部横线处理掉 */
.main-container {
  /* height: calc(100% - 4rem); */
}
</style>