import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'basic-plan-information',
  templateUrl: './basic-plan-information.component.html',
  styleUrls: ['./basic-plan-information.component.scss']
})
export class BasicPlanInformationComponent implements OnInit {
  activeItem: MenuItem
  displayModal = false
  @Input() collapse? = true
  @Input() collapseAvailability? = true
  @Input() collapseFreeLook? = true
  @Input() product: any[]
  constructor() { }

  ngOnInit(): void {
  }

}
