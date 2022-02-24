import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PlanHeaderComponent } from './plan-header.component'

describe('PlanHeaderComponent', () => {
  let component: PlanHeaderComponent
  let fixture: ComponentFixture<PlanHeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanHeaderComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
