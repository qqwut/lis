import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookieComponent } from './cookie/cookie.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';


@NgModule({
  declarations: [
    PrivacyComponent,
    CookieComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    ScrollPanelModule,
    ScrollTopModule,
  ]
})
export class PolicyModule { }
