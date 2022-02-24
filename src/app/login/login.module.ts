import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LoginRoutingModule } from './login-routing.module'
import { LoginComponent } from './component/login/login.component'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { FieldsetModule } from 'primeng/fieldset'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { NgxSpinnerModule } from 'ngx-spinner'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FieldsetModule,
    DialogModule,
    TableModule,
    ProgressSpinnerModule,
    TranslateModule,
  ],
})
export class LoginModule {}
