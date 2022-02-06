import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { PlanHeaderService } from '../../service/plan-header.service'

@Component({
  selector: 'basic-plan-information',
  templateUrl: './basic-plan-information.component.html',
  styleUrls: ['./basic-plan-information.component.scss'],
})
export class BasicPlanInformationComponent implements OnInit {
  activeItem: MenuItem
  displayModal = false
  @Input() collapse? = true
  @Input() collapseAvailability? = true
  @Input() collapseFreeLook? = true
  @Input() product: any[]
  constructor(private planHeaderService: PlanHeaderService) {}

  ngOnInit(): void {
    this.planHeaderService.getProduct().subscribe({
      next: (response: any) => {
        // debugger
      },
      error: (error: HttpErrorResponse) => {
        // debugger
      },
    })
  }
}
