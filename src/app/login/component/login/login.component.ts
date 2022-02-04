import { isPlatformBrowser } from '@angular/common'
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { NavigationEnd, Router, RouterEvent } from '@angular/router'
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent, NgcNoCookieLawEvent } from 'ngx-cookieconsent'
import { NgxSpinnerService } from "ngx-spinner"
import { filter, Subscription } from 'rxjs'
import { MenuService } from 'src/app/shared/services/menu/menu.service'
import { MENU_AT } from 'src/app/shared/constants/menu/menu.data'
import { LoginService } from '../../service/login.service'
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service'
import { AppConfigService } from '@app-root/app-config.service'
// import * as moment from "moment"
import "moment/locale/th"
import { I18nTranslateService } from '@app-root/shared/services/translate/i18n-translate.service'
import { UserService } from '@app-root/shared/services/user/user.service'
import { IUserItem } from '@app-root/shared/constants/user/user'
import { CookieStorageService } from '@app-root/shared/services/cookie/cookie-storage.service'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin!: FormGroup
  supportDevice = false
  loading = false
  products = [
    {
      browser: 'Chrome',
      support: 'ตั้งแต่เวอร์ชั่น 70 ขึ้นไป'
    },
    {
      browser: 'Safari',
      support: 'ตั้งแต่เวอร์ชั่น 10 ขึ้นไป'
    },
    {
      browser: 'iOS',
      support: 'ตั้งแต่เวอร์ชั่น 10 ขึ้นไป'
    },
    {
      browser: 'Android',
      support: 'Nougat (7.0), Marshmallow (6.0), Lollipop (5.0, 5.1)'
    }
  ]
  // private popupOpenSubscription: Subscription = new Subscription()
  // private popupCloseSubscription: Subscription = new Subscription()
  // private initializeSubscription: Subscription = new Subscription()
  // private statusChangeSubscription: Subscription = new Subscription()
  // private revokeChoiceSubscription: Subscription = new Subscription()
  // private noCookieLawSubscription: Subscription = new Subscription()

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private i18n: I18nTranslateService,
    private translateService: TranslateService,
    private ccService: NgcCookieConsentService,
    // @Inject(PLATFORM_ID) private platformId: any,
    private loginService: LoginService,
    private menuService: MenuService,
    private authenticationService: AuthenticationService,
    public appConfig: AppConfigService,
    private userService: UserService,
    private cookieStorageService: CookieStorageService
  ) {
    // this.router.events
    //   .pipe(filter((event: any) => event instanceof NavigationEnd))
    //   .subscribe(event => {
    //     if (isPlatformBrowser(this.platformId)) {
    //       window.scroll(0, 0)
    //     }
    //   })
    // this.i18n.changeLanguage('en')
  }

  get username() {
    return this.formLogin.get('username')
  }

  get password() {
    return this.formLogin.get('password')
  }

  get usernameInvalid() {
    return this.username.invalid && (this.username.dirty || this.username.touched)
  }

  get passwordInvalid() {
    return this.password.invalid && (this.password.dirty || this.password.touched)
  }

  ngOnInit() {
    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
    //   () => {
    //     console.log('popupOpen')
    //   })

    // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
    //   () => {
    //     console.log('popuClose')
    //   })

    // this.initializeSubscription = this.ccService.initialize$.subscribe(
    //   (event: NgcInitializeEvent) => {
    //     console.log(`initialize: ${JSON.stringify(event)}`)
    //   })

    // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
    //   (event: NgcStatusChangeEvent) => {
    //     console.log(`statusChange: ${JSON.stringify(event)}`)
    //   })

    // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
    //   () => {
    //     console.log(`revokeChoice`)
    //   })

    // this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
    //   (event: NgcNoCookieLawEvent) => {
    //     console.log(`noCookieLaw: ${JSON.stringify(event)}`)
    //   })

    this.initForm()

    // (Optional) support for translated cookies messages
    this.translateService.addLangs(['th'])
    this.translateService.setDefaultLang('th')
    this.i18n.changeLanguage('th')
  }

  changeLang() {
    // this.i18n.changeLanguage('en')
  }

  initForm() {
    const form = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ])
    })
    this.formLogin = new FormGroup(form.controls)
  }

  privacyClick() {
    this.router.navigate(['/privacypolicy'])
  }

  openSupportDevice() {
    this.supportDevice = true
  }

  signIn() {
    this.spinner.show()
    this.loginService
      .signIn({
        username: this.formLogin.value.username,
        password: this.formLogin.value.password,
      }).subscribe((res: IUserItem) => {
        this.cookieStorageService.setData('user', {
          userAD: res.userAD,
          userLis: res.userLis,
          email: res.email,
          roleid: res.roleid
        })
        this.cookieStorageService.setData('token', res.token)
        this.menuService.roleMenu(res && res.roleid)
        this.userService.setUser(res)
        this.spinner.hide()
        this.router.navigate(['/'])
      })
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    // this.popupOpenSubscription.unsubscribe()
    // this.popupCloseSubscription.unsubscribe()
    // this.initializeSubscription.unsubscribe()
    // this.statusChangeSubscription.unsubscribe()
    // this.revokeChoiceSubscription.unsubscribe()
    // this.noCookieLawSubscription.unsubscribe()
  }
}
