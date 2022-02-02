import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { NgcCookieConsentService, NgcInitializeEvent, NgcStatusChangeEvent, NgcNoCookieLawEvent } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin!: FormGroup;
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
  ];
  private popupOpenSubscription: Subscription = new Subscription();
  private popupCloseSubscription: Subscription = new Subscription();
  private initializeSubscription: Subscription = new Subscription();
  private statusChangeSubscription: Subscription = new Subscription();
  private revokeChoiceSubscription: Subscription = new Subscription();
  private noCookieLawSubscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private ccService: NgcCookieConsentService,
    @Inject(PLATFORM_ID) private platformId: any,
    private loginService: LoginService
  ) {
    this.router.events.pipe(
      // filter((events: RouterEvent) => {
      //   return events instanceof NavigationEnd
      // })
    ).subscribe(event => {
      if (isPlatformBrowser(this.platformId)) {
        window.scroll(0, 0);
      }
    });
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

    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log('popupOpen');
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log('popuClose');
      });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(`initialize: ${JSON.stringify(event)}`);
      });

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(`statusChange: ${JSON.stringify(event)}`);
      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(`revokeChoice`);
      });

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(`noCookieLaw: ${JSON.stringify(event)}`);
      });
    this.initForm()

    // (Optional) support for translated cookies messages
    // this.translateService.addLangs(['en', 'fr']);
    // this.translateService.setDefaultLang('en');
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
    });
    this.formLogin = new FormGroup(form.controls)
  }

  privacyClick() {
    this.router.navigate(['/privacypolicy']);
  }

  openSupportDevice() {
    this.supportDevice = true
  }

  signIn() {
    this.loginService.signIn({
      username: this.formLogin.value.username,
      password: this.formLogin.value.password,
    })
      .subscribe((res) => {
        this.router.navigate(['/']);
      }, (err) => {
      })
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }
}
