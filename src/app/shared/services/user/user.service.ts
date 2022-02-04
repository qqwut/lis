import { Injectable } from '@angular/core';
import { IUserItem } from '@app-root/shared/constants/user/user';
import { BehaviorSubject } from 'rxjs';
import { CookieStorageService } from '../cookie/cookie-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userBhv = new BehaviorSubject<IUserItem>(undefined);
  userItem$ = this.userBhv.asObservable();

  constructor(private cookieService: CookieStorageService) {
    const user = this.cookieService.getData('user')
    if (user) {
      this.userBhv.next(user)
    } else {
      this.userBhv.next(null)
    }
  }

  setUser(userItem: IUserItem) {
    this.userBhv.next(userItem)
  }

  clearUser() {
    this.userBhv.next(null)
  }
}
