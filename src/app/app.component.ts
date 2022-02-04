import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import 'moment/locale/th'
import {
    NgcCookieConsentService,
    NgcInitializeEvent,
    NgcNoCookieLawEvent,
    NgcStatusChangeEvent
} from 'ngx-cookieconsent';
import { CookieService } from 'ngx-cookie-service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    menuMode = 'static';

    colorScheme = 'light';

    menuTheme = 'layout-sidebar-darkgray';

    inputStyle = 'outlined';

    ripple: boolean;

    // private popupOpenSubscription: Subscription = new Subscription()
    // private popupCloseSubscription: Subscription = new Subscription()
    // private initializeSubscription: Subscription = new Subscription()
    // private statusChangeSubscription: Subscription = new Subscription()
    // private revokeChoiceSubscription: Subscription = new Subscription()
    // private noCookieLawSubscription: Subscription = new Subscription()


    constructor(
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private translateService: TranslateService,
        private ccService: NgcCookieConsentService,
        private cookieService: CookieService,
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe(event => {
                if (isPlatformBrowser(this.platformId)) {
                    window.scroll(0, 0)
                }
            })
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;

        this.NgxCookieConsent();
        let NgxCookieConsentValue = this.cookieService.get('cookieconsent_status');
        if (NgxCookieConsentValue === 'deny' || !NgxCookieConsentValue) {
            this.ccService.open();
        }

        // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
        //     () => {
        //         console.log('popupOpen')
        //     })

        // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
        //     () => {
        //         console.log('popuClose')
        //     })

        // this.initializeSubscription = this.ccService.initialize$.subscribe(
        //     (event: NgcInitializeEvent) => {
        //         console.log(`initialize: ${JSON.stringify(event)}`)
        //     })

        // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
        //     (event: NgcStatusChangeEvent) => {
        //         console.log(`statusChange: ${JSON.stringify(event)}`)
        //     })

        // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
        //     () => {
        //         console.log(`revokeChoice`)
        //     })

        // this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
        //     (event: NgcNoCookieLawEvent) => {
        //         console.log(`noCookieLaw: ${JSON.stringify(event)}`)
        //     })

        //(Optional) support for translated cookies messages
        this.translateService.addLangs(['th'])
        this.translateService.setDefaultLang('th')

        // this.popupOpenSubscription.unsubscribe()
        // this.popupCloseSubscription.unsubscribe()
        // this.initializeSubscription.unsubscribe()
        // this.statusChangeSubscription.unsubscribe()
        // this.revokeChoiceSubscription.unsubscribe()
        // this.noCookieLawSubscription.unsubscribe()
    }

    NgxCookieConsent() {
        let elementsth = {
            messagelink: `
          <span id="cookieconsent:desc" class="cc-message">{{message}} 
            <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}">{{cookiePolicyLink}}</a>  
             และ <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}">{{privacyPolicyLink}}</a>
          </span>
          `,
        };
        let content = {
            message: 'เว็บไซต์นี้ใช้คุกกี้เพื่อวัตถุประสงค์ในการปรับปรุงประสบการณ์ของผู้ใช้ให้ดียิ่งขึ้น ท่านสามารถศึกษารายละเอียดเพิ่มเติมเกี่ยวกับคุกกี้  เหตุผลในการใช้คุกกี้ และวิธีการตั้งค่าคุกกี้ได้ใน',
            allow: 'รับทราบ',
            deny: 'ปฏิเสธ',
            policy: 'Cookie Policy',
            cookiePolicyLink: 'นโยบายการใช้คุกกี้ ',
            cookiePolicyHref: 'cookie-policy',
            privacyPolicyLink: 'นโยบายการคุ้มครองข้อมูลส่วนบุคคล',
            privacyPolicyHref: 'privacy-policy',
        }
        // //console.log(window.location.hostname + this.appGlobals.GC_HOST_HREF);
        this.ccService.getConfig().cookie.domain = window.location.hostname;
        this.ccService.getConfig().cookie.path = '/';
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        this.ccService.getConfig().content.message = content.message;
        this.ccService.getConfig().content.allow = content.allow;
        this.ccService.getConfig().content.deny = content.deny;
        this.ccService.getConfig().elements = elementsth;
        this.ccService.getConfig().content.policy = content.policy;
        this.ccService.getConfig().content['cookiePolicyLink'] = content.cookiePolicyLink;
        this.ccService.getConfig().content['cookiePolicyHref'] = content.cookiePolicyHref;
        this.ccService.getConfig().content['privacyPolicyLink'] = content.privacyPolicyLink;
        this.ccService.getConfig().content['privacyPolicyHref'] = content.privacyPolicyHref;
        this.ccService.destroy();//remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages

    }
}
