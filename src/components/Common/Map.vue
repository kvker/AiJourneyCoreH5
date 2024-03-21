<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
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
const attraction: Attraction = JSON.parse(localStorage.getItem('attraction') as string)

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')

  onLocation().then((ll) => {
    onRenderDrawMap()
    map.centerAndZoom(lnglat2Ll(attraction.lnglat), defaultZoom)
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
      // console.log('地图获取状态：' + status)
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

function onAutoLocation() {
  setTimeout(() => {
    onLocation().then(ll => {
      markerSelf = onUpdateMarker(ll2Lnglat(ll), markerSelf)
      onAutoLocation()
    })
  }, 3000)
}

async function getAreaList() {
  const { data } = await collection.where({
    attractionId: props.attraction._id,
  }).limit(100).get()
  map.panTo(new T.LngLat(props.attraction.lnglat.longitude, props.attraction.lnglat.latitude))
  onRenderAreaList(data)
}

function onRenderAreaList(data: Area[]) {
  data.forEach((item: Area) => {
    onAddLabel(item)
  })
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
  // label = new T.Label({
  //   text: item.name,
  //   position: new T.LngLat(item.lnglat.longitude, item.lnglat.latitude),
  //   offset: new T.Point(-9, 0)
  // })
  // //创建地图文本对象
  // map.addOverLay(label)
  // label.addEventListener('click', function () {
  //   console.log('点击了' + item.name)
  // })
  // const lnglat = item.lnglat
  // const infoWin = new T.InfoWindow()
  // infoWin.setContent(`<p class="sdakfjlaskdjlskfdjsdflkj">${item.name}</p>`)
  // marker = new T.Marker(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 创建标注
  // map.addOverLay(marker) // 将标注添加到地图中
  // marker.addEventListener("click", function () {
  //   marker.openInfoWindow(infoWin)
  // })
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
</script>

<template>
  <div id="mapDiv" class=""></div>
</template>

<style scoped>
#mapDiv {
  height: 100vh;
}
</style>