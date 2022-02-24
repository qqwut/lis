import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CookieComponent } from './cookie/cookie.component'
import { PrivacyComponent } from './privacy/privacy.component'

const routes: Routes = [
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'cookie',
    component: CookieComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule {}
