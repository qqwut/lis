import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'premium-information',
  templateUrl: './premium-information.component.html',
  styleUrls: ['./premium-information.component.scss'],
})
export class PremiumInformationComponent implements OnInit {
  displayModal = false
  collapsePremium = true
  @Input() collapse = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
