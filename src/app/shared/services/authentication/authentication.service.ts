import { Injectable } from '@angular/core'
import { MENU_AT } from '../../constants/menu/menu.data'
import { CookieStorageService } from '../cookie/cookie-storage.service'
import { MenuService } from '../menu/menu.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private menuService: MenuService,
    private CookieStorageService: CookieStorageService
  ) {
    const user = this.CookieStorageService.getData('user')
    if (user) {
      this.authentication(user.roleId)
    }
  }

  authentication(roleId) {

    if (!roleId) return

    switch (roleId) {
      case 'AT':
        return this.menuService.setItems(MENU_AT)
      default:
        break
    }

  }
}
