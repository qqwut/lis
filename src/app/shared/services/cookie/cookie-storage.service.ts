import { Injectable } from '@angular/core'
import { KeyCookieData } from '@app-root/shared/interfaces/cookie/cookie'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {

  constructor(private cookieService: CookieService) {
  }

  setData(key: KeyCookieData, data: Object) {
    this.cookieService.set(key, JSON.stringify(data))
  }

  getData(key: KeyCookieData) {
    const data = this.cookieService.get(key)
    if (!data || data === 'undefined' || data === '{}') {
      return null
    }
    return JSON.parse(data)
  }

}
