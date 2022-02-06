import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service'
import { NgcCookieConsentService , NgcStatusChangeEvent } from 'ngx-cookieconsent'
import { Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private statusChangeSubscription: Subscription = new Subscription()
  constructor(
    private ccService: NgcCookieConsentService,
    private cookieService: CookieService,
    private translateService: TranslateService
  ) {
    // const browserLang = this.translateService.getBrowserLang()
    // const lang = browserLang.match(/en|th/) ? browserLang : 'th'
    this.translateService.use('th')
    const status = this.cookieService.get('cookieconsent_status')

    if (status === 'allow') {
      // this.ccService.close(false)
      this.ccService.destroy()
      if (this.statusChangeSubscription) {
        this.statusChangeSubscription.unsubscribe()
      }
    } else if (status === 'deny' || !status) {
      this.ccService.open()
      this.init()
    } else {
      this.init()
    }

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        if (event.status === 'allow') {
          this.ccService.destroy()
          if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe()
          }
        }
      }
    )
  }

  init() {
    this.translateService
      .get([
        'COOKIE.HEADER',
        'COOKIE.MESSAGE',
        'COOKIE.DISMISS',
        'COOKIE.ALLOW',
        'COOKIE.DENY',
        'COOKIE.LINK',
        'COOKIE.POLICY',
        'COOKIE.COOKIE_POLICY_LINK',
        'COOKIE.PRIVACY_POLICY_LINK',
      ])
      .subscribe(data => {
        this.ccConfig.content = this.ccConfig.content || {}

        if (this.EN) {
          this.ccConfig.elements = {
            messagelink: `
            <span id="cookieconsent:desc" class="cc-message">{{message}} 
              <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank">{{cookiePolicyLink}}</a>, 
              <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank">{{privacyPolicyLink}}</a> and our 
              <a aria-label="learn more about our terms of service" tabindex="2" class="cc-link" href="{{tosHref}}" target="_blank">{{tosLink}}</a>
            </span>
            `,
          }
        } else {
          this.ccConfig.elements = {
            messagelink: `
            <span id="cookieconsent:desc" class="cc-message">{{message}} 
              <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}">{{cookiePolicyLink}}</a> และ 
              <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}">{{privacyPolicyLink}}</a>
            </span>
            `,
          }
        }

        this.ccConfig.content.message = data['COOKIE.MESSAGE']
        this.ccConfig.content.header = data['COOKIE.HEADER']
        this.ccConfig.content.dismiss = data['COOKIE.DISMISS']
        this.ccConfig.content.allow = data['COOKIE.ALLOW']
        this.ccConfig.content.deny = data['COOKIE.DENY']
        this.ccConfig.content.link = data['COOKIE.LINK']
        this.ccConfig.content.policy = data['COOKIE.POLICY']
        this.ccConfig.content['cookiePolicyLink'] = data['COOKIE.COOKIE_POLICY_LINK']
        this.ccConfig.content['privacyPolicyLink'] = data['COOKIE.PRIVACY_POLICY_LINK']
        this.ccService.destroy() //remove previous cookie bar (with default messages)
        this.ccService.init(this.ccConfig) // update config with translated messages
      })
  }

  get ccConfig() {
    return this.ccService.getConfig()
  }

  get TH(): boolean {
    return (
      this.translateService.currentLang.toLocaleLowerCase() === 'th' || false
    )
  }

  get EN(): boolean {
    return (
      this.translateService.currentLang.toLocaleLowerCase() === 'en' || false
    )
  }
}
