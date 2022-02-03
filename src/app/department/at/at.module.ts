import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtRoutingModule } from './at-routing.module';
import { PlanHeaderComponent } from './plan-header/plan-header.component';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
@NgModule({
  declarations: [
    PlanHeaderComponent
  ],
  imports: [
    CommonModule,
    AtRoutingModule,
    FieldsetModule,
    TableModule,
    TabMenuModule
  ]
})
export class AtModule { }
