import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
})
export class GeneralInformationComponent implements OnInit {
  displayModal = false
  collapseCalculation = true
  collapseNonForfeiture = true
  @Input() collapse = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
