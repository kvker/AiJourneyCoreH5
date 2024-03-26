<script lang="ts" setup>
import { onMounted, watch, ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import Map from '@/services/map'
import type { TmClickEventParams } from '@/services/map'
import Static from '@/services/static'

import { useAreaList } from '@/composables/areaList'
import { useMapIntroduce } from '@/composables/mapIntroduce'

const props = defineProps({
  defaultLnglat: {
    type: Object as () => Lnglat | null,
    default: null,
  },
  attraction: {
    type: Object as () => Attraction,
    required: true,
  },
})

const { areaList, getAreaList } = useAreaList()
const { autoPlay, audioRef, currentAudioSrc, onChangeAuto, onAutoPlay, } = useMapIntroduce(areaList)

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
  await getAreaList(props.attraction._id)
  areaList.value.forEach((item: Area) => {
    mapInstance.onAddLabel({ text: item.name, lnglat: item.lnglat, clickCallback: onClickMapLabel })
  })
  onEventLoop()
})


function onClickMapLabel(e: TmClickEventParams) {
  console.log('点击了地图标签: ', e.target.options.text)
}

async function onEventLoop() {
  const lnglat = await mapInstance.onAutoLocation()
  setTimeout(onEventLoop, 10000)
  if (autoPlay.value) onAutoPlay(Map.normalizeLnglat(lnglat))
}
</script>

<template>
  <div id="mapDiv" class=""></div>
  <button class="location-button btn btn-primary btn-sm top-8 right-2" :disabled="autoPlay"
    @click="mapInstance.onLocationSelf">定位当前</button>
  <div class="area-list w-full left-0 bottom-16 translate-y-0 transition-transform"
    :class="autoPlay ? 'translate-y-48' : 'translate-y-0'">
    <div class="w-24 bg-white rounded-lg flex flex-col items-center justify-center ml-auto mr-2 mb-2"
      :class="autoPlay ? 'bottom-64' : 'bottom-20'">
      <label class="cursor-pointer label">
        <input type="checkbox" class="toggle toggle-primary" @change="onChangeAuto" />
      </label>
      <p class="text-xs">自动讲解</p>
    </div>
    <ul class="bg-white w-full h-48 overflow-y-scroll">
      <li v-for="item in areaList" :key="item._id" class="flex items-center justify-between p-2">
        <img class="w-12 h-12 rounded-full" :src="Static.miniImage(item.coverImageList[0])" alt="cover-image">
        <section class="info flex-1 ml-2">
          <h3 class=" text-base">{{ item.name }}</h3>
          <p class=" text-gray-400 text-xs">{{ item.name }}</p>
        </section>
        <img class=" w-6 h-6" :src="item.playState === 'ended' ? '/icons/audio.png' : '/icons/audio-disabled.png'"
          alt="audio">
      </li>
    </ul>
  </div>
  <audio ref="audioRef" :src="currentAudioSrc" class="audio-player fixed left-full"></audio>
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