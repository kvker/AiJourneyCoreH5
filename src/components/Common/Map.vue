<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const collection = db.collection('JArea')

let map: any
  , marker: any
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

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  // map.addEventListener("click", onMapClick)

  new T.Geolocation().getCurrentPosition(function (this: any, e: any) {
    if (this.getStatus() === 0 || this.getStatus() === 1) {
      map.centerAndZoom(e.lnglat, 15)
      if (props.defaultLnglat) {
        addMarker(props.defaultLnglat)
      }
      getAreaList()
    }
    loading.value = false
  }, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 60000,
  })
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   const { latitude, longitude } = position.coords
  //   map.centerAndZoom(new T.LngLat(longitude, latitude), 16)
  //   if (props.defaultLnglat) {
  //     addMarker(props.defaultLnglat)
  //   }
  //   loading.value = false
  // }, function (error) {
  //   console.error(error)
  //   loading.value = false
  // })
})

onUnmounted(() => {
  // map.removeEventListener("click", onMapClick)
})

async function getAreaList() {
  const { data } = await collection.where({
    attractionId: props.attraction._id,
  }).limit(100).get()
  console.log(data)
  onRenderAreaList(data)
}

function onRenderAreaList(data: Area[]) {
  data.forEach((item: Area) => {
    addMarker(item.lnglat)
  })
}

function onMapClick({ lnglat }: { lnglat: Lnglat }) {
  // addMarker(lnglat)
}

function addMarker(lnglat: Lnglat) {
  // if (marker) {
  //   map.removeOverLay(marker) // 移除标注
  // }
  marker = new T.Marker(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 创建标注
  map.addOverLay(marker) // 将标注添加到地图中
  map.panTo(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 将地图中心点更改为标注的位置
}

function onChoose() {
  if (!marker) {
    alert('请选择一个坐标点')
    return
  }
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