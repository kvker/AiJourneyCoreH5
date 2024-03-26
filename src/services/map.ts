export type TmClickEventParams = { target: { options: { text: string } } }

export default class Map {
  static ll2Lnglat(ll: LL): Lnglat {
    return {
      longitude: ll.lng,
      latitude: ll.lat,
    }
  }

  static lnglat2Ll(lnglat: Lnglat): LL {
    return {
      lng: lnglat.longitude,
      lat: lnglat.latitude,
    }
  }

  static normalizeLnglat(point: Lnglat | LL): Lnglat {
    if ('lng' in point) return Map.ll2Lnglat(point)
    else return point

  }

  static distance(lnglat1: Lnglat, lnglat2: Lnglat) {
    const radLat1 = lnglat1.latitude * Math.PI / 180.0
    const radLat2 = lnglat2.latitude * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lnglat1.longitude * Math.PI / 180.0 - lnglat2.longitude * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10000
    return s * 1000
  }

  TmKey = '7679c343623ec0339bd308138c672120' // 天地图的 key
  defaultZoom = 18
  map: any
  marker: any
  markerSelf: any

  constructor({ lnglat }: { lnglat: Lnglat }) {
    this.map = new T.Map('mapDiv')
    this.onSetCenter(lnglat)
  }

  onSetCenter(point: Lnglat | LL) {
    this.map.centerAndZoom(Map.lnglat2Ll(Map.normalizeLnglat(point)), this.defaultZoom)
  }

  onRenderDrawMap(leftBottom: Lnglat, rightTop: Lnglat, imageUrl: string) {
    const bd = new T.LngLatBounds(
      leftBottom,
      rightTop)
    const img = new T.ImageOverlay(imageUrl, bd, {
      opacity: 1,
      alt: "长河老街"
    })
    this.map.addOverLay(img)
  }

  testLlList = [{ lng: 120.19025, lat: 30.17306 }, { lng: 120.1898, lat: 30.17278 }, { lng: 120.18948, lat: 30.1725 }, { lng: 120.18901, lat: 30.172 }, { lng: 120.18842, lat: 30.17164 }, { lng: 120.18922, lat: 30.17272 }, { lng: 120.18879, lat: 30.17309 }, { lng: 120.1885, lat: 30.17338 }, { lng: 120.18786, lat: 30.17288 }, { lng: 120.18814, lat: 30.17374 }, { lng: 120.18763, lat: 30.17413 }, { lng: 120.18851, lat: 30.1741 }]

  async onLocation(): Promise<LL> {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({ lng: 120.19025, lat: 30.17306 })
    }
    return new Promise((s, j) => {
      new T.Geolocation().getCurrentPosition(function (this: any, e: any) {
        const status = this.getStatus()
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

  onLocationSelf() {
    this.onLocation().then(ll => {
      this.onSetCenter(ll)
    })
  }

  async onAutoLocation(): Promise<LL> {
    const ll = await this.onLocation()
    const lnglat = Map.ll2Lnglat(ll)
    this.markerSelf = this.onUpdateMarker(lnglat, this.markerSelf)
    return ll
  }

  onAddMarker(lnglat: Lnglat, handleMarker = this.marker) {
    handleMarker = new T.Marker(new T.LngLat(lnglat.longitude, lnglat.latitude)) // 创建标注
    this.map.addOverLay(handleMarker) // 将标注添加到地图中
    return handleMarker
  }

  onUpdateMarker(lnglat: Lnglat, handleMarker: any) {
    if (handleMarker) handleMarker.setLngLat(new T.LngLat(lnglat.longitude, lnglat.latitude))
    else handleMarker = this.onAddMarker(lnglat, handleMarker)
    return handleMarker
  }

  onAddLabel({ text, lnglat, clickCallback }: { text: string, lnglat: Lnglat, clickCallback: (e: TmClickEventParams) => void }) {
    const label = new T.Label({
      text,
      position: new T.LngLat(lnglat.longitude, lnglat.latitude),
      offset: new T.Point(-9, 0)
    })
    //创建地图文本对象
    this.map.addOverLay(label)
    label.addEventListener('click', clickCallback)
  }
}