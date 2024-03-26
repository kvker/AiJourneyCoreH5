<script lang="ts" setup>
import { onMounted, watch, ref, nextTick, inject } from 'vue'
import type { Ref } from 'vue'
import Map from '@/services/map'
import type { TmClickEventParams } from '@/services/map'

const props = defineProps({
  defaultLnglat: {
    type: Object as () => Lnglat,
    required: true,
  },
  overlayList: {
    type: Array as () => MapOverlay[],
    default: () => [],
  },
  readonly: {
    type: Boolean,
    required: true,
  },
  shouldResponseOverlay: {
    type: Object as () => MapOverlay | null,
  },
})

watch(() => props.shouldResponseOverlay, newOverlay => {
  console.log(newOverlay)
  newOverlay && mapInstance.onSetCenter(newOverlay.lnglat)
})

const emit = defineEmits<{
  (e: 'activeOverlay', overlay: MapOverlay): void
}>()

function onAutoPlay(lnglat: Lnglat) {
  let minDistance = 50
  let minItem: MapOverlay | undefined
  props.overlayList.forEach((item) => {
    if(item.playState === 'ended') return
    const dis = Map.distance(lnglat, item.lnglat)
    if (dis < minDistance) {
      minDistance = dis
      minItem = item
    }
  })
  if (minItem) {
    console.log('查询到满足条件的最近景点是： ', minItem.name)
    emit('activeOverlay', minItem)
  } else {
    console.log('未命中最近景区')
  }
}

const darwMapObject = {
  url: "https://6169-ai-tools-6guwawtsb724a7e7-1254288091.tcb.qcloud.la/images/changhelaojie/handDrawMap.png?sign=0992f6947aba9e9928ecbba881893ab9&t=1710771342",
  leftBottom: [120.18664, 30.17085],
  rightTop: [120.19098, 30.1753],
}
let mapInstance: Map
onMounted(async () => {
  // 地图
  mapInstance = new Map({
    lnglat: props.defaultLnglat,
  })

  mapInstance.onRenderDrawMap(new T.LngLat(...darwMapObject.leftBottom), new T.LngLat(...darwMapObject.rightTop), darwMapObject.url)

  onEventLoop()
})

watch(() => props.overlayList, () => {
  props.overlayList.forEach((item) => {
    mapInstance.onAddLabel({ text: item.name, lnglat: item.lnglat, clickCallback: onClickMapLabel })
  })
})

function onClickMapLabel(e: TmClickEventParams) {
  console.log('点击了地图标签: ', e.target.options.text)
  emit('activeOverlay', props.overlayList.find((item) => item.name === e.target.options.text) as MapOverlay)
}

async function onEventLoop() {
  if (props.readonly) {
    console.log('readonly loop')
    const lnglat = await mapInstance.onAutoLocation()
    mapInstance.onSetCenter(lnglat)
    onAutoPlay(Map.normalizeLnglat(lnglat))
  }
  setTimeout(onEventLoop, 10000)
}
</script>

<template>
  <div id="mapDiv" class=""></div>
  <button class="location-button btn btn-primary btn-sm top-8 right-2" :disabled="props.readonly"
    @click="mapInstance.onLocationSelf">
    <img class="local-icon w-4 h-4" src="/icons/local.png" alt="local-icon">
    同步定位
  </button>
</template>

<style scoped>
#mapDiv {
  height: 100vh;
}

.location-button,
.area-list {
  position: fixed;
  z-index: 1001;
}
</style>