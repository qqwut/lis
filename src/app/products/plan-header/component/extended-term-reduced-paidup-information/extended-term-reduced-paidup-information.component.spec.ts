import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTermReducedPaidupInformationComponent } from './extended-term-reduced-paidup-information.component';

describe('ExtendedTermReducedPaidupInformationComponent', () => {
  let component: ExtendedTermReducedPaidupInformationComponent;
  let fixture: ComponentFixture<ExtendedTermReducedPaidupInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedTermReducedPaidupInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTermReducedPaidupInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
