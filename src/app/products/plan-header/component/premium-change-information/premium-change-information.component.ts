import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'premium-change-information',
  templateUrl: './premium-change-information.component.html',
  styleUrls: ['./premium-change-information.component.scss'],
})
export class PremiumChangeInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
