import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HeaderDividerRoutingModule } from './header-divider-routing.module'
import { HeaderDividerComponent } from './header-divider.component'
import { DividerModule } from 'primeng/divider'
import { ButtonModule } from 'primeng/button'

@NgModule({
  declarations: [HeaderDividerComponent],
  imports: [CommonModule, HeaderDividerRoutingModule, DividerModule, ButtonModule],
  exports: [HeaderDividerComponent],
})
export class HeaderDividerModule {}
