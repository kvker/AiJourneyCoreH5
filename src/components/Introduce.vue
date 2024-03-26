<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

const props = defineProps({
  area: {
    type: Object as () => Area,
    required: true,
  },
  areaIntroduce: {
    type: Object as () => AreaIntroduce,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onClickClose() {
  emit('close')
}
</script>

<template>
  <div
    class="introduce-component fixed left-0 top-0 w-full h-full bg-opacity-20 bg-black flex items-center justify-center">
    <div class="hero w-11/12 h-5/6 bg-base-200 rounded-2xl">
      <div class="hero-content flex-col lg:flex-row">
        <img :src="props.area.coverImageList[0]" class=" h-48 w-full object-cover rounded-lg shadow-2xl" />
        <div>
          <h1 class="text-3xl font-bold">{{ props.area.name }}</h1>
          <p class="py-6 text-sm h-80 overflow-y-scroll">{{ areaIntroduce.introduce }}</p>
          <button class="btn btn-primary" @click="onClickClose">暂停&关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduce-component {
  z-index: 1003;
}
</style>