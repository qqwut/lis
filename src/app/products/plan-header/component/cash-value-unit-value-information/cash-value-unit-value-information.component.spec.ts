import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashValueUnitValueInformationComponent } from './cash-value-unit-value-information.component';

describe('CashValueUnitValueInformationComponent', () => {
  let component: CashValueUnitValueInformationComponent;
  let fixture: ComponentFixture<CashValueUnitValueInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashValueUnitValueInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashValueUnitValueInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
