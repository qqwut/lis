import { Component, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { MenuItem } from 'primeng/api'
import { BreadcrumbService } from '@app-shared/services/breadcrumb/breadcrumb.service'
import { AppComponent } from '@app-root/app.component'
import { AppMainComponent } from '@app-root/app.main.component'
import { Router } from '@angular/router'
import { CookieStorageService } from '@app-root/shared/services/cookie/cookie-storage.service'
import { MenuService } from '@app-root/shared/services/menu/menu.service'
import { AuthenticationService } from '@app-root/shared/services/authentication/authentication.service'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy {
  subscription = new Subscription()
  items: MenuItem[]

  constructor(
    public breadcrumbService: BreadcrumbService,
    public appMain: AppMainComponent,
    public app: AppComponent,
    private router: Router,
    // public user: UserService,
    public authentication: AuthenticationService,
    public menu: MenuService,
  ) {

    // this.subscription = breadcrumbService.itemsHandler
    //   .subscribe(response => {
    //     this.items = response
    //   })

    // this.authentication.user.subscribe(response => {
    // this.user = response
    // })
  }

  signOut() {
    this.authentication.logout()
    this.menu.reset()
  }

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe()
    // }
  }

}
