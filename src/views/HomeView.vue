<script lang="ts" setup>
import { ref, } from 'vue'
import router from '@/router'

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