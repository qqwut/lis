import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoadReinstateInformationComponent } from './load-reinstate-information.component'

describe('LoadReinstateInformationComponent', () => {
  let component: LoadReinstateInformationComponent
  let fixture: ComponentFixture<LoadReinstateInformationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadReinstateInformationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadReinstateInformationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
