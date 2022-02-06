import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { AppMainComponent } from './app.main.component'
import { NotfoundPageComponent } from './shared/components/notfound-page/notfound-page.component'
import { AuthGuard } from './shared/services/helpers/auth.guard'
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppMainComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: 'plan-header',
              canActivate: [],
              loadChildren: () =>
                import(
                  '@app-root/products/plan-header/plan-header.module'
                ).then(m => m.PlanHeaderModule),
            },
            // {
            //     path: 'at',
            //     loadChildren: () => import('./department/at/at.module').then(m => m.AtModule),
            //     canActivate: []
            // }
          ],
        },
        {
          path: 'login',
          loadChildren: () =>
            import('./login/login.module').then(m => m.LoginModule),
        },
        { path: 'notfound', component: NotfoundPageComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      { scrollPositionRestoration: 'enabled' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
