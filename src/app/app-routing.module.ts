import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {
                        path: 'at',
                        loadChildren: () => import('./department/at/at.module').then(m => m.AtModule),
                        canActivate: []
                    }
                ]
            },
            // { path: 'error', component: AppErrorComponent },
            // { path: 'access', component: AppAccessdeniedComponent },
            // { path: 'notfound', component: AppNotfoundComponent },
            {
                path: 'login',
                loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
                canActivate: []
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
