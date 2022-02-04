import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumInformationComponent } from './premium-information.component';

describe('PremiumInformationComponent', () => {
  let component: PremiumInformationComponent;
  let fixture: ComponentFixture<PremiumInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
