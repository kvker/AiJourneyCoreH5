<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const collection = db.collection('JArea')

let map: any
  , marker: any
  , label: any
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
const loading = ref(false)

let leftBottom = new T.LngLat(120.18664, 30.17085)
let rightTop = new T.LngLat(120.19098, 30.1753)

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  // map.addEventListener("click", onMapClick)

  new T.Geolocation().getCurrentPosition(function (this: any, e: any) {
    const status = this.getStatus()
    console.log('地图获取状态：' + status)
    if (status < 2) {
      map.centerAndZoom(e.lnglat, 18)
      map.setMaxBounds(new T.LngLatBounds(leftBottom, rightTop))
      if (props.defaultLnglat) {
        onAddMarker(props.defaultLnglat)
      }
      getAreaList()
      onRenderDrawMap()
    }
    loading.value = false
  }, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 60000,
  })
})

onUnmounted(() => {
  // map.removeEventListener("click", onMapClick)
})

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

function onAddMarker(lnglat: Lnglat) {
  // if (marker) {
  //   map.removeOverLay(marker) // 移除标注
  // }
  marker = new T.Marker(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 创建标注
  map.addOverLay(marker) // 将标注添加到地图中
  map.panTo(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 将地图中心点更改为标注的位置
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