import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanHeaderComponent } from './plan-header/plan-header.component';

const routes: Routes = [
  {
    path: 'plan-header',
    component: PlanHeaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtRoutingModule { }
