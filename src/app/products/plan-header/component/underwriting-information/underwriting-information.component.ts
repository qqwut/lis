import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'underwriting-information',
  templateUrl: './underwriting-information.component.html',
  styleUrls: ['./underwriting-information.component.scss'],
})
export class UnderwritingInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
