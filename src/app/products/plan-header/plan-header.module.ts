import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanHeaderRoutingModule } from './plan-header-routing.module';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { BasicPlanInformationComponent } from './component/basic-plan-information/basic-plan-information.component';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ButtonModule } from 'primeng/button';
import { GeneralInformationComponent } from './component/general-information/general-information.component';
import { UnderwritingInformationComponent } from './component/underwriting-information/underwriting-information.component';
import { PremiumInformationComponent } from './component/premium-information/premium-information.component';
import { CommissionInformationComponent } from './component/commission-information/commission-information.component';
import { PlanHeaderComponent } from './component/main/plan-header.component';
import { ModeComponent } from './component/mode/mode.component';
import { LoadReinstateInformationComponent } from './component/load-reinstate-information/load-reinstate-information.component';
import { ParticipationDividendInformationComponent } from './component/participation-dividend-information/participation-dividend-information.component';
import { CashValueUnitValueInformationComponent } from './component/cash-value-unit-value-information/cash-value-unit-value-information.component';
import { ExtendedTermReducedPaidupInformationComponent } from './component/extended-term-reduced-paidup-information/extended-term-reduced-paidup-information.component';
import { MaturityInformationComponent } from './component/maturity-information/maturity-information.component';
import { ExpiryInformationComponent } from './component/expiry-information/expiry-information.component';
import { PremiumChangeInformationComponent } from './component/premium-change-information/premium-change-information.component';

@NgModule({
  declarations: [
    PlanHeaderComponent,
    BasicPlanInformationComponent,
    GeneralInformationComponent,
    UnderwritingInformationComponent,
    PremiumInformationComponent,
    CommissionInformationComponent,
    ModeComponent,
    LoadReinstateInformationComponent,
    ParticipationDividendInformationComponent,
    CashValueUnitValueInformationComponent,
    ExtendedTermReducedPaidupInformationComponent,
    MaturityInformationComponent,
    ExpiryInformationComponent,
    PremiumChangeInformationComponent
  ],
  imports: [
    CommonModule,
    PlanHeaderRoutingModule,
    FieldsetModule,
    TableModule,
    TabMenuModule,
    DividerModule,
    DialogModule,
    ScrollPanelModule,
    ScrollTopModule,
    ButtonModule
  ]
})
export class PlanHeaderModule { }
