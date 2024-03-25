import { ref, onMounted, } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

export function useAreaList() {
  const collection = db.collection('JArea')

  const areaList: Ref<Area[]> = ref([])

  async function getAreaList(attractionId: string) {
    const { data } = await collection.where({
      attractionId,
    }).limit(100).get()
    areaList.value = data
  }

  return { areaList, getAreaList, }
}