<script lang="ts" setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import { lnglat2Ll } from '@/services/map'
import { db } from '@/services/cloud'
import { ll2Lnglat } from '@/services/map';

const collection = db.collection('JArea')

let map: any
  , marker: any
  , markerSelf: any
  , label: any
  , defaultZoom = 18
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

let leftBottom = new T.LngLat(120.18664, 30.17085)
let rightTop = new T.LngLat(120.19098, 30.1753)

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')

  onLocation().then((ll) => {
    onRenderDrawMap()
    map.centerAndZoom(lnglat2Ll(props.attraction.lnglat), defaultZoom)
    // map.setMaxBounds(new T.LngLatBounds(leftBottom, rightTop))
    if (props.defaultLnglat) {
      onAddMarker(props.defaultLnglat)
    }
    getAreaList()
    onAutoLocation()
  })
})

function onLocation(): Promise<LL> {
  return new Promise((s, j) => {
    new T.Geolocation().getCurrentPosition(function (this: any, e: any) {
      const status = this.getStatus()
      if (status < 2) {
        s(e.lnglat)
      } else {
        j(false)
      }
    }, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 60000,
    })
  })
}

function onLocationSelf() {
  onLocation().then(ll => {
    map.centerAndZoom(ll, defaultZoom)
  })
}

function onAutoLocation() {
  setTimeout(() => {
    onAutoLocation()
    if (!autoPlay.value) return
    onLocation().then(ll => {
      const lnglat = ll2Lnglat(ll)
      markerSelf = onUpdateMarker(lnglat, markerSelf)
      onAutoPlay(lnglat)
    })
  }, 3000)
}

function onAddMarker(lnglat: Lnglat, handleMarker = marker) {
  handleMarker = new T.Marker(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 创建标注
  map.addOverLay(handleMarker) // 将标注添加到地图中
  return handleMarker
}

function onUpdateMarker(lnglat: Lnglat, handleMarker: any) {
  if (handleMarker) handleMarker.setLngLat(new T.LngLat(lnglat.longitude, lnglat.latitude))
  else handleMarker = onAddMarker(lnglat, handleMarker)
  // map.centerAndZoom(lnglat2Ll(lnglat), defaultZoom) // 跟踪位置
  return handleMarker
}

function onAddLabel(item: Area) {
  const label = new T.Label({
    text: item.name,
    position: new T.LngLat(item.lnglat.longitude, item.lnglat.latitude),
    offset: new T.Point(-9, 0)
  })
  //创建地图文本对象
  map.addOverLay(label)
  label.addEventListener('click', function () {
    console.log(item)
    console.log('点击了' + item.name)
  })
}

function onRenderDrawMap() {
  const bd = new T.LngLatBounds(
    leftBottom,
    rightTop)
  const img = new T.ImageOverlay("https://6169-ai-tools-6guwawtsb724a7e7-1254288091.tcb.qcloud.la/images/changhelaojie/handDrawMap.png?sign=0992f6947aba9e9928ecbba881893ab9&t=1710771342", bd, {
    opacity: 1,
    alt: "长河老街"
  })
  map.addOverLay(img)
}

// 列表处理
const areaList: Ref<Area[]> = ref([])
async function getAreaList() {
  const { data } = await collection.where({
    attractionId: props.attraction._id,
  }).limit(100).get()
  map.panTo(new T.LngLat(props.attraction.lnglat.longitude, props.attraction.lnglat.latitude))
  onRenderAreaList(data)
  areaList.value = data
}

function onRenderAreaList(data: Area[]) {
  data.forEach((item: Area) => {
    onAddLabel(item)
  })
}

function miniImage(url: string) {
  if (url.includes('?')) return url + '&imageView2/2/h/80'
  else return url += '?imageView2/2/h/80'
}

// 讲解区域
const autoPlay = ref(false)
const audio: Ref<HTMLAudioElement | null> = ref(null)
const currentAudioSrc = ref('')

onMounted(() => {
  audio.value!.addEventListener('ended', e => {
    console.log('语音自动讲解结束播完')
    const currentPlayArea = areaList.value.find(i => i.playState === 'playing')
    currentPlayArea && (currentPlayArea.playState = 'ended')
  })
})

function onChangeAuto() {
  autoPlay.value = !autoPlay.value
  if (!autoPlay.value && !audio.value!.paused) audio.value!.pause()
}

function onAutoPlay(lnglat: Lnglat) {
  let minDistance = Infinity
  let minArea: Area = areaList.value[0]
  areaList.value.forEach((item: Area) => {
    if (item.playState === 'ended') return
    // 勾股定理开方
    const distance = Math.sqrt(Math.pow(item.lnglat.longitude - lnglat.longitude, 2) + Math.pow(item.lnglat.latitude - lnglat.latitude, 2))
    if (distance < minDistance) {
      minDistance = distance
      minArea = item
    }
  })
  onPlay(minArea)
}

async function onPlay(area: Area) {
  const paused = audio.value!.paused
  if (paused) {
    const areaIntroduce = await getAreaIntroduce(area)
    currentAudioSrc.value = areaIntroduce.voice
    nextTick(() => {
      area.playState = 'playing'
      audio.value!.play()
    })
  }
}

async function getAreaIntroduce(area = areaList.value[0]) {
  const chatStyleIndex = Number(localStorage.getItem('chatStyleIndex')) || 0
  const { data }: CloudResponse<AreaIntroduce> = await db.collection('JAreaIntroduce').where({
    areaId: area._id,
    chatStyleId: ['65b4d24bfdf6021d30d61a57', '65b4d246fdf6021d30d61a56', '65b4d2587ac027333bc13ddd'][chatStyleIndex],
  }).get()
  const areaIntroduce = data[0]
  console.log(areaIntroduce.introduce)
  console.log('讲解内容')
  return areaIntroduce
}
</script>

<template>
  <div id="mapDiv" class=""></div>
  <button class="location-button btn btn-primary btn-sm top-8 right-2" :disabled="autoPlay"
    @click="onLocationSelf">定位当前</button>
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
        <img class="w-12 h-12 rounded-full" :src="miniImage(item.coverImageList[0])" alt="cover-image">
        <section class="info flex-1 ml-2">
          <h3 class=" text-base">{{ item.name }}</h3>
          <p class=" text-gray-400 text-xs">{{ item.name }}</p>
        </section>
        <img class=" w-6 h-6" :src="item.playState === 'ended' ? '/icons/audio.png' : '/icons/audio-disabled.png'"
          alt="audio">
      </li>
    </ul>
  </div>
  <audio ref="audio" :src="currentAudioSrc" class="audio-player fixed left-full"></audio>
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