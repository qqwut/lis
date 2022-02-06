import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'load-reinstate-information',
  templateUrl: './load-reinstate-information.component.html',
  styleUrls: ['./load-reinstate-information.component.scss'],
})
export class LoadReinstateInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse = true
  @Input() product: any[]
  constructor() {}

  ngOnInit(): void {}
}
