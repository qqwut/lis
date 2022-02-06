import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UnderwritingInformationComponent } from './underwriting-information.component'

describe('UnderwritingInformationComponent', () => {
  let component: UnderwritingInformationComponent
  let fixture: ComponentFixture<UnderwritingInformationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnderwritingInformationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderwritingInformationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
