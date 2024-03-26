<script lang="ts" setup>
import { ref, computed, watch, inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import Introduce from '@/components/Introduce.vue'
import { useAreaIntroduce } from '@/composables/areaIntroduce'
import Static from '@/services/static'
import { db } from '@/services/cloud'

const collection = db.collection('JArea')

onMounted(() => {
  getAreaList(props.attraction._id)
  audioRef.value!.addEventListener('ended', e => {
    const currentPlayArea = areaListRef.value.find(i => i.playState === 'playing')
    console.log(currentPlayArea?.name + ' 语音自动讲解结束播完')
    currentPlayArea && (currentPlayArea.playState = 'ended')
  })
})

const props = defineProps({
  attraction: {
    type: Object as () => Attraction,
    required: true,
  },
  shouldResponseArea: {
    type: Object as () => Area | null,
  },
})

const emit = defineEmits<{
  (e: 'activeArea', area: Area): void
}>()

watch(() => props.shouldResponseArea, newArea => {
  // console.log(newArea)
  // console.log(props.shouldResponseArea)
  if (newArea) {
    onPlay(newArea)
    onMoveToArea(newArea)
  }
})

const areaListRef = defineModel({ default: [], required: true }) as Ref<Area[]>
const ulRef = ref<HTMLUListElement | null>(null)
const { autoPlayRef, audioRef, areaIntroduceRef, onPlay, onCleanAreaIntroduce } = useAreaIntroduce(areaListRef)

async function getAreaList(attractionId: string) {
  const { data } = await collection.where({
    attractionId,
  }).limit(100).get()
  areaListRef.value = data
}

function onChangeAuto() {
  autoPlayRef.value = !autoPlayRef.value
  if (!autoPlayRef.value && !audioRef.value!.paused) audioRef.value!.pause()
}

function onClickArea(area: Area) {
  onPlay(area)
  emit('activeArea', area)
}

function onMoveToArea(area: Area) {
  ulRef.value!.scrollTop = areaListRef.value.indexOf(area) * 64
}

function onCloseIntroduce() {
  onCleanAreaIntroduce()
}
</script>

<template>
  <div class="area-list absolute w-full left-0 bottom-16 translate-y-0 transition-transform"
    :class="autoPlayRef ? 'translate-y-48' : 'translate-y-0'">
    <div class="w-24 bg-white rounded-lg flex flex-col items-center justify-center ml-auto mr-2 mb-2"
      :class="autoPlayRef ? 'bottom-64' : 'bottom-20'">
      <label class="cursor-pointer label">
        <input type="checkbox" class="toggle toggle-primary" @change="onChangeAuto" />
      </label>
      <p class="text-xs text-primary">自动讲解</p>
    </div>
    <ul ref="ulRef" class="bg-white w-full h-48 overflow-y-scroll scroll-smooth">
      <li v-for="item in areaListRef" :key="item._id" class="flex items-center justify-between p-2"
        @click="onClickArea(item)">
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
  <audio ref="audioRef" :src="areaIntroduceRef?.voice" class="audio-player fixed left-full"></audio>
  <Introduce v-if="areaIntroduceRef && props.shouldResponseArea" :area="props.shouldResponseArea"
    :areaIntroduce="areaIntroduceRef" @close="onCloseIntroduce" />
</template>

<style scoped>
.area-list {
  z-index: 1002;
}
</style>