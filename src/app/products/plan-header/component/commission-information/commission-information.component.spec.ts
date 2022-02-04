import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionInformationComponent } from './commission-information.component';

describe('CommissionInformationComponent', () => {
  let component: CommissionInformationComponent;
  let fixture: ComponentFixture<CommissionInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
