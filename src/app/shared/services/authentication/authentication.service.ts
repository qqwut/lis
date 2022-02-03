import { Injectable } from '@angular/core';
import { MENU_AT } from '../../constants/menu/menu.data';
import { MenuService } from '../menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private menuService: MenuService) { }

  authentication(roleId) {
    if (!roleId) {
      return
    }
    switch (roleId) {
      case 'AT':
        return this.menuService.setItems(MENU_AT)

      default:
        break;
    }
  }
}
