import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationDividendInformationComponent } from './participation-dividend-information.component';

describe('ParticipationDividendInformationComponent', () => {
  let component: ParticipationDividendInformationComponent;
  let fixture: ComponentFixture<ParticipationDividendInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationDividendInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationDividendInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
