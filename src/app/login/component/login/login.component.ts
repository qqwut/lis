import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { MenuService } from 'src/app/shared/services/menu/menu.service'
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service'
import { AppConfig } from '@app-root/app-config'
import { I18nTranslateService } from '@app-root/shared/services/translate/i18n-translate.service'
import { IUserItem } from '@app-root/shared/interfaces/user/user'
import { BROWSER } from '@app-root/shared/constants/cookie/cookie'
import { HttpErrorResponse } from '@angular/common/http'
import Swal from 'sweetalert2'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import {
  appShadowTrigger,
  appTrigger,
  contentTrigger,
  textResultTrigger,
} from '@app-root/shared/animations/animate'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [contentTrigger, appTrigger, appShadowTrigger, textResultTrigger],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup
  browserList = BROWSER
  supportDevice = false
  messageError: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private i18n: I18nTranslateService,
    private menuService: MenuService,
    public appConfig: AppConfig,
    private authenticationService: AuthenticationService,
    public translate: TranslatePipe
  ) {}

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
  }

  initForm() {
    const form = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    })
    this.formLogin = new FormGroup(form.controls)
  }

  onPrivacy() {
    this.router.navigate(['policy/privacy'])
    // const url = this.router.serializeUrl(this.router.createUrlTree(['#/policy/privacy']))
    // window.open(url, '_blank')
  }

  onSupport() {
    this.supportDevice = true
  }

  signIn() {
    this.messageError = null
    this.spinner.show()
    this.authenticationService.login(this.formLogin.value).subscribe({
      next: (userItem: IUserItem) => {
        this.menuService.roleMenu(userItem.roleid)
        this.spinner.hide()
        this.router.navigate(['/'])
      },
      error: (error: HttpErrorResponse) => {
        this.spinner.hide()
        Swal.fire({
          icon: 'error',
          title: 'Login Failed.',
          text: error.message,
          showConfirmButton: false,
        })
      },
    })
  }

  ngOnDestroy() {}
}
