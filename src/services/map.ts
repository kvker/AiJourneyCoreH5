const TmKey = '7679c343623ec0339bd308138c672120' // 天地图的 key

/**
 *
 * @param ll {lng, lat}
 * @returns lnglat {longitude, latitude}
 */
export function ll2Lnglat(ll: LL): Lnglat {
  return {
    longitude: ll.lng,
    latitude: ll.lat,
  }
}

export function lnglat2Ll(lnglat: Lnglat): LL {
  return {
    lng: lnglat.longitude,
    lat: lnglat.latitude,
  }
}

export async function getGeocoder(name: string): Promise<Lnglat | undefined> {
  const ret = await fetch(`http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${name}"}&tk=${TmKey}`)
  const json = await ret.json()
  const location = json.location
  // console.log({ location })
  if (location) {
    return {
      longitude: location.lon,
      latitude: location.lat,
    }
  }
}

export function distance(lnglat1: Lnglat, lnglat2: Lnglat) {
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