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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private i18n: I18nTranslateService,
    private loginService: LoginService,
    private menuService: MenuService,
    public appConfig: AppConfigService,
    private userService: UserService,
    private cookieStorageService: CookieStorageService
  ) { }

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
    this.initForm()
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
    this.router.navigate(['/privacy-policy'])
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

  ngOnDestroy() { }
}
