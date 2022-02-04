import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityInformationComponent } from './maturity-information.component';

describe('MaturityInformationComponent', () => {
  let component: MaturityInformationComponent;
  let fixture: ComponentFixture<MaturityInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
