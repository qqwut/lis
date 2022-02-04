import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'participation-dividend-information',
  templateUrl: './participation-dividend-information.component.html',
  styleUrls: ['./participation-dividend-information.component.scss']
})
export class ParticipationDividendInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product :any[]

  constructor() { }

  ngOnInit(): void {
  }

}
