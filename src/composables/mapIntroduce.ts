import { ref, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import Map from '@/services/map'
import { db } from '@/services/cloud'

export function useMapIntroduce(areaList: Ref<Area[]>) {
  const collection = db.collection('JAreaIntroduce')

  // 讲解区域
  const autoPlay = ref(false)
  const audioRef: Ref<HTMLAudioElement | null> = ref(null)
  const currentAudioSrc = ref('')

  onMounted(() => {
    audioRef.value!.addEventListener('ended', e => {
      const currentPlayArea = areaList.value.find(i => i.playState === 'playing')
      console.log(currentPlayArea?.name + ' 语音自动讲解结束播完')
      currentPlayArea && (currentPlayArea.playState = 'ended')
    })
  })

  function onChangeAuto() {
    autoPlay.value = !autoPlay.value
    if (!autoPlay.value && !audioRef.value!.paused) audioRef.value!.pause()
  }

  function onAutoPlay(lnglat: Lnglat) {
    let minDistance = 20
    let minArea: Area = areaList.value[0]
    let name = ''
    areaList.value.forEach((item: Area) => {
      if (item.playState === 'ended') return
      const dis = Map.distance(lnglat, item.lnglat)
      if (dis < minDistance) {
        minDistance = dis
        minArea = item
        name = item.name
      }
    })
    if (name) {
      console.log(name, minDistance)
      onPlay(minArea)
    } else {
      console.log('没有找到区域')
    }
  }

  async function onPlay(area: Area) {
    const paused = audioRef.value!.paused
    if (paused) {
      const areaIntroduce = await getAreaIntroduce(area)
      currentAudioSrc.value = areaIntroduce.voice
      nextTick(() => {
        area.playState = 'playing'
        audioRef.value!.play()
      })
    }
  }

  async function getAreaIntroduce(area = areaList.value[0]) {
    const chatStyleIndex = Number(localStorage.getItem('chatStyleIndex')) || 0
    const { data }: CloudResponse<AreaIntroduce> = await collection.where({
      areaId: area._id,
      chatStyleId: ['65b4d24bfdf6021d30d61a57', '65b4d246fdf6021d30d61a56', '65b4d2587ac027333bc13ddd'][chatStyleIndex],
    }).get()
    const areaIntroduce = data[0]
    console.log(areaIntroduce.introduce)
    console.log('讲解内容')
    return areaIntroduce
  }
  return { autoPlay, audioRef, currentAudioSrc, onChangeAuto, onAutoPlay, }
}