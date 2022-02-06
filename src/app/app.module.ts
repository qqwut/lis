import { NgModule, APP_INITIALIZER } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { AppRoutingModule } from './app-routing.module'

// COMPONENT
import { AppComponent } from './app.component'
import { AppMainComponent } from './app.main.component'
import { MenuRightComponent } from '@app-shared/components/menu/menu-right/menu-right.component'
import { MenuItemComponent } from '@app-shared/directives/menu/menu-item/menu-item.component'
import { TopbarComponent } from '@app-shared/components/menu/topbar/topbar.component'
import { SearchComponent } from '@app-shared/components/search/search.component'
import { FooterComponent } from '@app-shared/components/footer/footer.component'
import { NotfoundPageComponent } from './shared/components/notfound-page/notfound-page.component'
import { MenuLeftComponent } from '@app-shared/components/menu/menu-left/menu-left.component'

// SERVICE
import { BreadcrumbService } from '@app-shared/services/breadcrumb/breadcrumb.service'
import { MenuService } from './shared/services/menu/menu.service'
import { AppConfigService } from './app-config.service'
import { I18nTranslateService } from './shared/services/translate/i18n-translate.service'
import { CookieStorageService } from './shared/services/cookie/cookie-storage.service'
import { AuthenticationService } from './shared/services/authentication/authentication.service'

// HELPER
import {
  NgcCookieConsentModule,
  NgcCookieConsentService,
} from 'ngx-cookieconsent'
import {
  TranslateModule,
  TranslateLoader,
  TranslatePipe,
} from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HELPER_INTERCEPTORS } from './shared/services/helpers'
import { cookieConfig } from './shared/constants/consent/consent'
import { PrimeNgModule } from './shared/modules/prime-ng/prime-ng.module'
import { NgxSpinnerModule } from 'ngx-spinner'
import { CookieConsentService } from './shared/services/cookie/cookie-consent.service'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    PrimeNgModule,
    NgxSpinnerModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    MenuRightComponent,
    MenuLeftComponent,
    MenuItemComponent,
    TopbarComponent,
    FooterComponent,
    SearchComponent,
    MenuRightComponent,
    MenuLeftComponent,
    NotfoundPageComponent,
  ],
  providers: [
    TranslatePipe,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    AppConfigService,
    AuthenticationService,
    MenuService,
    BreadcrumbService,
    I18nTranslateService,
    CookieStorageService,
    CookieConsentService,
    NgcCookieConsentService,
    HELPER_INTERCEPTORS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
