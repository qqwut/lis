import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'expiry-information',
  templateUrl: './expiry-information.component.html',
  styleUrls: ['./expiry-information.component.scss'],
})
export class ExpiryInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
