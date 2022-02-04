import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'commission-information',
  templateUrl: './commission-information.component.html',
  styleUrls: ['./commission-information.component.scss']
})
export class CommissionInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse = true
  @Input() product: any[]

  constructor() { }

  ngOnInit(): void {
  }

}
