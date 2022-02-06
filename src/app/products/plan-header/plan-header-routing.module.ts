import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlanHeaderComponent } from './component/main/plan-header.component'

const routes: Routes = [
  {
    path: '',
    component: PlanHeaderComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanHeaderRoutingModule {}
