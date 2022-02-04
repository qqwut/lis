import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from "@angular/router";
import { Observable } from 'rxjs';
import { CookieStorageService } from '../cookie/cookie-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private cookieStorageService: CookieStorageService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    return this.checkPermission(url);
    // : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // const urlPath = localStorage.getItem('urlPath');
    // return this.operatorService.hasProfile$.pipe(
    //   take(1),
    //   tap(hasProfile => !hasProfile && this.router.navigate([`/${urlPath}`])),
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  checkPermission(url: string): boolean {
    const user = this.cookieStorageService.getData('user')
    const token = this.cookieStorageService.getData('token')

    if (user && token) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;

    }
  }
}