import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http'
import { Observable, throwError, BehaviorSubject } from 'rxjs'
import { catchError, filter, take, switchMap } from 'rxjs/operators'
import { AuthenticationService } from '../authentication/authentication.service'
import { IUserItem } from '@app-root/shared/interfaces/user/user'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  )

  constructor(public authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken()
    if (token) request = this.addToken(request, token)
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401)
          return this.handle401Error(request, next)
        else return throwError(() => error)
      })
    )
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)
      return this.authService.refreshToken().pipe(
        switchMap((user: IUserItem) => {
          this.isRefreshing = false
          this.refreshTokenSubject.next(user.token)
          this.authService.setToken(user.token)
          this.authService.setUser(user)
          return next.handle(this.addToken(request, user.token))
        })
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt))
        })
      )
    }
  }
}
