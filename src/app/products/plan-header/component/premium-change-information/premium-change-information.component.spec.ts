import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumChangeInformationComponent } from './premium-change-information.component';

describe('PremiumChangeInformationComponent', () => {
  let component: PremiumChangeInformationComponent;
  let fixture: ComponentFixture<PremiumChangeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumChangeInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumChangeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
