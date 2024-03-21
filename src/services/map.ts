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