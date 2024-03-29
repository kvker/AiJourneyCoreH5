declare const T: any

type CloudResponse<T> = {
  data: T[]
  requestId: string
}

type Lnglat = {
  longitude: number
  latitude: number
}
type LL = {
  lng: number
  lat: number
}

type CloudItem = {
  _id: string
}

type PlayState = { playState?: 'playing' | 'ended' | 'paused' }

type Attraction = {
  name: string
  introduce: string
  hello: string
  introduceImageList: url[]
  ipList: url[]
  introduceVideo: string
  lnglat: Lnglat
  knowledgeId: string
} & CloudItem

type Area = {
  coverImageList: url[]
  introduce: string
  lnglat: Lnglat
  name: string
  innerName: string // 内部使用名
} & CloudItem & PlayState

type AreaSearchParams = {
  name: string
}

type ChatStyle = {
  name: string
  remind: string
  sort: number
  previousPrompt: string
  tailPrompt: string
  voiceType: number
} & CloudItem

type AreaForm = Omit<Area, 'coverImageList'> & {
  coverImageList: File[]
  attractionId: string
}

type AreaIntroduce = {
  areaId: string
  chatStyleId: string
  introduce: string
  chatStyleList: ChatStyle[]
  voice: string
} & CloudItem

type Toilet = {
  coverImageList: url[]
  introduce: string
  lnglat: Lnglat | null
  name: string
} & CloudItem

type ToiletSearchParams = {
  name: string
}

type ToiletForm = Omit<Toilet, 'coverImageList'> & {
  coverImageList: File[]
  attractionId: string
}

type Attention = {
  coverImageList: url[]
  introduce: string
  lnglat: Lnglat | null
  name: string
} & CloudItem

type AttentionSearchParams = {
  name: string
}

type AttentionForm = Omit<Attention, 'coverImageList'> & {
  coverImageList: File[]
  attractionId: string
}