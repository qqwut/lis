import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'extended-term-reduced-paidup-information',
  templateUrl: './extended-term-reduced-paidup-information.component.html',
  styleUrls: ['./extended-term-reduced-paidup-information.component.scss'],
})
export class ExtendedTermReducedPaidupInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
