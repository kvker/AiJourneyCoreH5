<script lang="ts" setup>
import { onMounted, watch, ref, nextTick, inject } from 'vue'
import type { Ref } from 'vue'
import Map from '@/services/map'
import type { TmClickEventParams } from '@/services/map'

type OverlayItem = ({ lnglat: Lnglat, name: string } & CloudItem)

const props = defineProps({
  defaultLnglat: {
    type: Object as () => Lnglat | null,
    default: null,
  },
  attraction: {
    type: Object as () => Attraction,
    required: true,
  },
  overlayList: {
    type: Array as () => OverlayItem[],
    default: () => [],
  }
})

// 讲解区域
const autoPlay = inject('autoPlay') as Ref<boolean>

function onAutoPlay(lnglat: Lnglat) {
  let minDistance = 20
  let minItem = props.overlayList[0]
  props.overlayList.forEach((item) => {
    const dis = Map.distance(lnglat, item.lnglat)
    if (dis < minDistance) {
      minDistance = dis
      minItem = item
    }
  })
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
    lnglat: props.attraction.lnglat,
  })

  mapInstance.onRenderDrawMap(new T.LngLat(...darwMapObject.leftBottom), new T.LngLat(...darwMapObject.rightTop), darwMapObject.url)

  if (props.defaultLnglat) {
    mapInstance.onAddMarker(props.defaultLnglat)
  }
  onEventLoop()
})

watch(() => props.overlayList, () => {
  props.overlayList.forEach((item) => {
    mapInstance.onAddLabel({ text: item.name, lnglat: item.lnglat, clickCallback: onClickMapLabel })
  })
})

function onClickMapLabel(e: TmClickEventParams) {
  console.log('点击了地图标签: ', e.target.options.text)
}

async function onEventLoop() {
  const lnglat = await mapInstance.onAutoLocation()
  if (autoPlay.value) mapInstance.onSetCenter(lnglat)
  setTimeout(onEventLoop, 10000)
  if (autoPlay.value) onAutoPlay(Map.normalizeLnglat(lnglat))
}
</script>

<template>
  <div id="mapDiv" class=""></div>
  <button class="location-button btn btn-primary btn-sm top-8 right-2" :disabled="autoPlay"
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