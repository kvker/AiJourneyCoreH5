import { describe, expect, it } from 'vitest'
import Map from './map'

describe('ll2Lnglat', () => {
  it('should convert latitude and longitude to lnglat format', () => {
    const lnglat = Map.ll2Lnglat({ lng: -74.0060, lat: 40.7128 })
    expect(lnglat).toEqual({ longitude: -74.0060, latitude: 40.7128 })
  })
})

describe('lnglat2Ll', () => {
  it('should convert lnglat format to latitude and longitude', () => {
    const ll = Map.lnglat2Ll({ longitude: -74.0060, latitude: 40.7128 })
    expect(ll).toEqual({ lng: -74.0060, lat: 40.7128 })
  })
})


