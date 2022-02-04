import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cash-value-unit-value-information',
  templateUrl: './cash-value-unit-value-information.component.html',
  styleUrls: ['./cash-value-unit-value-information.component.scss']
})
export class CashValueUnitValueInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product :any[]

  constructor() { }

  ngOnInit(): void {
  }

}
