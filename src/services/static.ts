export default class Static {
  static miniImage(url: string) {
    if (url.includes('?')) return url + '&imageView2/2/h/80'
    else return url += '?imageView2/2/h/80'
  }

  constructor() {

  }


}