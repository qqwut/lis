import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryInformationComponent } from './expiry-information.component';

describe('ExpiryInformationComponent', () => {
  let component: ExpiryInformationComponent;
  let fixture: ComponentFixture<ExpiryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiryInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
