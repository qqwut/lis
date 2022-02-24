import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BasicPlanInformationComponent } from './basic-plan-information.component'

describe('BasicPlanInformationComponent', () => {
  let component: BasicPlanInformationComponent
  let fixture: ComponentFixture<BasicPlanInformationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicPlanInformationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicPlanInformationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
