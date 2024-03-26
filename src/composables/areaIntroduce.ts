import { ref, onMounted, nextTick, inject } from 'vue'
import type { Ref } from 'vue'
import Map from '@/services/map'
import { db } from '@/services/cloud'

export function useAreaIntroduce(areaListRef: Ref<Area[]>) {
  const collection = db.collection('JAreaIntroduce')

  // 讲解区域
  const autoPlayRef = inject('autoPlayRef') as Ref<boolean>
  const currentAudioSrcRef = ref('')
  const audioRef: Ref<HTMLAudioElement | null> = ref(null)

  onMounted(() => {
    audioRef.value!.addEventListener('ended', e => {
      const currentPlayArea = areaListRef.value.find(i => i.playState === 'playing')
      console.log(currentPlayArea?.name + ' 语音自动讲解结束播完')
      currentPlayArea && (currentPlayArea.playState = 'ended')
    })
  })

  async function onPlay(area: Area) {
    const paused = audioRef.value!.paused
    if (paused) {
      const areaIntroduce = await getAreaIntroduce(area)
      currentAudioSrcRef.value = areaIntroduce.voice
      nextTick(() => {
        area.playState = 'playing'
        audioRef.value!.play()
      })
    }
  }

  async function getAreaIntroduce(area = areaListRef.value[0]) {
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
  return { autoPlayRef, audioRef, currentAudioSrcRef, onPlay }
}