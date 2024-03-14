<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

let map: any
  , marker: any
  , lo: any
const emit = defineEmits(['choose', 'close'])
const props = defineProps({
  visible: Boolean,
  defaultLnglat: {
    type: Object as () => Lnglat | null,
    default: null,
  },
})
const loading = ref(false)
const mapDialog: Ref<HTMLDialogElement | undefined> = ref()

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  map.addEventListener("click", onMapClick)
  lo = new T.Geolocation()

  lo.getCurrentPosition(function (this: any, e: any) {
    if (this.getStatus() == 0) {
      map.centerAndZoom(e.lnglat, 15)
      if (props.defaultLnglat) {
        addMarker(props.defaultLnglat)
      }
    }
    if (this.getStatus() == 1) {
      map.centerAndZoom(e.lnglat, 15)
      if (props.defaultLnglat) {
        addMarker(props.defaultLnglat)
      }
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
  map.removeEventListener("click", onMapClick)
})

function onMapClick({ lnglat }: { lnglat: Lnglat }) {
  // emit('choose', e.lnglat)
  addMarker(lnglat)
}

function addMarker(lnglat: Lnglat) {
  if (marker) {
    map.removeOverLay(marker) // 移除标注
  }
  marker = new T.Marker(new T.LngLat(lnglat.lng, lnglat.lat)) // 创建标注
  map.addOverLay(marker) // 将标注添加到地图中
  map.panTo(new T.LngLat(lnglat.lng, lnglat.lat)) // 将地图中心点更改为标注的位置
}

function onChoose() {
  if (!marker) {
    alert('请选择一个坐标点')
    return
  }
  mapDialog.value!.close()
  emit('choose', marker.getLngLat())
}
</script>

<template>
  <div id="mapDiv" class=" h-full"></div>
</template>

<style scoped></style>