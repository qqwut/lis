import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: 'plan-header',
    canActivate: [],
    loadChildren: () =>
      import('@app-root/products/plan-header/plan-header.module').then(
        m => m.PlanHeaderModule
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
