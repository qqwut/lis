import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { AppConfigService } from '@app-root/app-config.service'
import {
  IReqLogin,
  IResLogin,
  IUserItem,
} from '@app-root/shared/interfaces/user/user'
import { CookieStorageService } from '@app-shared/services/cookie/cookie-storage.service'
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<IUserItem>
  public user$: Observable<IUserItem>
  private userItem: IUserItem
  // private refreshTokenTimeout

  constructor(
    private router: Router,
    private http: HttpClient,
    private appConfig: AppConfigService,
    private cookieStorageService: CookieStorageService
  ) {
    this.userSubject = new BehaviorSubject<IUserItem>(null)
    this.user$ = this.userSubject.asObservable()
    const user = this.cookieStorageService.getData('user')
    if (user) {
      this.userSubject.next(user)
    } else {
      this.userSubject.next(null)
    }
  }

  public get userValue(): IUserItem {
    return this.userSubject.value
  }

  getToken() {
    return this.cookieStorageService.getData('token')
  }

  setToken(token) {
    this.cookieStorageService.setData('token', token)
  }

  clearUser() {
    this.cookieStorageService.setData('user', null)
  }

  setUser(user) {
    this.userItem = {
      userAD: user.userAD,
      userLis: user.userLis,
      email: user.email,
      roleid: user.roleid,
    }
    this.userSubject.next(this.userItem)
    this.cookieStorageService.setData('user', this.userItem)
  }

  login(data): Observable<any> {
    return this.http
      .post<any>(`${this.appConfig.BASE_URL}/api/Auth/Login`, data)
      .pipe(
        tap((user: IUserItem) => {
          this.setToken(user.token)
          this.setUser(user)
        }),
        map(res => ({
          userAD: res.userAD,
          roleid: res.roleid,
        }))
        // catchError((error) => {
        //   return of(error)
        // })
      )
  }

  logout() {
    this.http
      .post<any>(
        `${this.appConfig.BASE_URL}/api/revoke-token`,
        {}
        // { withCredentials: true }
      )
      .subscribe()
    // this.stopRefreshTokenTimer()
    this.userSubject.next(null)
    this.clearUser()
    this.router.navigate(['/login'])
  }

  refreshToken() {
    return this.http
      .post<any>(
        `${this.appConfig.BASE_URL}/api/refresh-token`,
        {}
        // { withCredentials: true }
      )
      .pipe(
        map(user => {
          this.userSubject.next(user)
          // this.startRefreshTokenTimer()
          return user
        })
      )
  }

  // helper methods

  // private startRefreshTokenTimer() {
  //   // parse json object from base64 encoded jwt token
  //   const jwtToken = JSON.parse(atob(this.userValue.token.split('.')[1]))
  //   // set a timeout to refresh the token a minute before it expires
  //   // const expires = new Date(jwtToken.exp * 1000)
  //   // MOCK EXPIRES
  //   const expires = new Date(jwtToken.exp * 10000)
  //   const timeout = expires.getTime() - Date.now() - 60 * 1000
  //   this.refreshTokenTimeout = setTimeout(() =>
  //     this.refreshToken().subscribe()
  //     , timeout)
  // }

  // private stopRefreshTokenTimer() {
  //   clearTimeout(this.refreshTokenTimeout)
  // }
}
