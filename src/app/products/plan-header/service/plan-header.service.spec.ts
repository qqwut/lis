import { TestBed } from '@angular/core/testing'

import { PlanHeaderService } from './plan-header.service'

describe('PlanHeaderService', () => {
  let service: PlanHeaderService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PlanHeaderService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
