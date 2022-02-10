import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AppMainComponent } from './app.main.component'
import { NotfoundPageComponent } from './shared/components/notfound-page/notfound-page.component'
import { AuthGuard } from './shared/services/helpers/auth.guard'

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'policy',
    loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule),
  },
  {
    path: '',
    component: AppMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('@app-root/products/products.module').then(m => m.ProductsModule),
      },
    ],
  },
  { path: 'notfound', component: NotfoundPageComponent },
  { path: '**', redirectTo: '/notfound' },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
