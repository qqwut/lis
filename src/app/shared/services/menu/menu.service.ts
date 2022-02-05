import { Injectable } from '@angular/core';
import { MENU_AT } from '@app-root/shared/constants/menu/menu.data';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { CookieStorageService } from '../cookie/cookie-storage.service';

@Injectable()
export class MenuService {

    private menuSource = new Subject<string>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    private itemsSource = new BehaviorSubject<any[]>([]);
    itemsHandler$ = this.itemsSource.asObservable();

    constructor(private authentication: AuthenticationService) {
        this.authentication.user$.subscribe((user) => {
            if (user && user.roleid) {
                this.roleMenu(user.roleid)
            }
        })
    }

    roleMenu(roleId) {

        if (!roleId) return

        switch (roleId) {
            case 'AT':
                return this.setItems(MENU_AT)
            default:
                break
        }

    }

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    reset() {
        this.resetSource.next('');
        this.itemsSource.next(null);
    }

    setItems(items: any[]) {
        this.itemsSource.next(items);
    }
}
