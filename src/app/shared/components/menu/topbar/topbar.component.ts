import { Component, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { MenuItem } from 'primeng/api'
import { BreadcrumbService } from '@app-shared/services/breadcrumb/breadcrumb.service'
import { AppComponent } from '@app-root/app.component'
import { AppMainComponent } from '@app-root/app.main.component'
import { UserService } from '@app-root/shared/services/user/user.service'
import { IUserItem } from '@app-root/shared/constants/user/user'
import { Router } from '@angular/router'
import { CookieStorageService } from '@app-root/shared/services/cookie/cookie-storage.service'
import { MenuService } from '@app-root/shared/services/menu/menu.service'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy {
  subscription: Subscription
  items: MenuItem[]
  // user$: Observable<IUserItem>
  // user: IUserItem

  constructor(
    public breadcrumbService: BreadcrumbService,
    public appMain: AppMainComponent,
    public app: AppComponent,
    private router: Router,
    public user: UserService,
    public menu: MenuService,
    private cookieStorageService: CookieStorageService,
  ) {

    this.subscription = breadcrumbService.itemsHandler
      .subscribe(response => {
        this.items = response
      })

    // this.subscription.add(
    // this.user.userItem$.subscribe(response => {
    // this.user = response
    // })
    // )

    // this.subscription.add(
    //   breadcrumbService.itemsHandler.subscribe(response => {
    //     this.items = response
    //   })
    // )

    // this.tieredItems = [
    //   {
    //     label: 'Home',
    //   },
    //   {
    //     label: 'Search Plan',
    //     items: [
    //       {
    //         label: 'View',
    //         icon: 'pi pi-fw pi-list'
    //       },
    //       {
    //         label: 'Search',
    //         icon: 'pi pi-fw pi-search'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Instructions',
    //   },
    //   {
    //     label: 'Terms and Conditions'
    //   },
    //   {
    //     label: 'Session Info'
    //   },
    //   {
    //     label: 'Application Info'
    //   },
    //   {
    //     label: 'About Program'
    //   }
    // ]
  }

  signOut() {
    this.cookieStorageService.setData('user', null)
    this.user.clearUser()
    this.menu.reset()
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
