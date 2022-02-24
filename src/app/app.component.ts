import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { TranslateService } from '@ngx-translate/core'
import { filter, Subscription } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'
import { isPlatformBrowser } from '@angular/common'
import 'moment/locale/th'
import { CookieConsentService } from './shared/services/cookie/cookie-consent.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuMode = 'static'

  colorScheme = 'light'

  menuTheme = 'layout-sidebar-darkgray'

  inputStyle = 'outlined'

  ripple: boolean

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private cookieConsentService: CookieConsentService,
    private translateService: TranslateService
  ) {
    // private cookie: CookieConsentService // @Inject(PLATFORM_ID) private platformId: any
    // this.router.events
    //   .pipe(filter((event: any) => event instanceof NavigationEnd))
    //   .subscribe(event => {
    //     if (isPlatformBrowser(this.platformId)) {
    //       window.scroll(0, 0)
    //     }
    //   })
    const browserLang = this.translateService.getBrowserLang()
    const lang = browserLang.match(/en|th/) ? browserLang : 'en'
    this.translateService.use(lang)
    this.translateService.setDefaultLang(lang)
  }

  ngOnInit() {
    this.primengConfig.ripple = true
    this.ripple = true
  }
}
