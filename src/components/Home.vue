<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue'
import type { Ref, InjectionKey } from 'vue'
import Map from '@/components/Common/Map.vue'
import AreaList from '@/components/AreaList.vue'

const areaList = ref<Area[]>([])

const autoPlayRef = ref(false)
provide('autoPlayRef', autoPlayRef)

const attractionRef = ref(JSON.parse(localStorage.getItem('attraction') as string))

const currentActiveOverlayRef = ref<MapOverlay | null>(null)
const currentActiveAreaRef = ref<Area | null>(null)

function onActiveOverlay(overlay: MapOverlay) {
  currentActiveOverlayRef.value = overlay
  currentActiveAreaRef.value = areaList.value.find(i => i._id === overlay._id) as Area
  console.log('Home派发激活的覆盖物：', currentActiveOverlayRef.value.name)
}

function onActiveArea(area: Area) {
  currentActiveAreaRef.value = area
  currentActiveOverlayRef.value = {
    _id: area._id,
    name: area.name,
    lnglat: area.lnglat,
  }
  console.log('Home派发激活的景点：', currentActiveAreaRef.value.name)
}

function onCloseIntroduce() {
  currentActiveAreaRef.value!.playState = 'ended'
}
</script>

<template>
  <div class="home-container">
    <Map :defaultLnglat="attractionRef.lnglat" :overlay-list="areaList" :readonly="autoPlayRef"
      :shouldResponseOverlay="currentActiveOverlayRef" @active-overlay="onActiveOverlay" />
    <AreaList v-model="areaList" :attraction="attractionRef" :shouldResponseArea="currentActiveAreaRef"
      @active-area="onActiveArea" @close-introduce="onCloseIntroduce" />
  </div>
</template>

<style scoped>
.home-container {
  height: calc(100% - 4rem);
}
</style>