import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'maturity-information',
  templateUrl: './maturity-information.component.html',
  styleUrls: ['./maturity-information.component.scss']
})
export class MaturityInformationComponent implements OnInit {
  displayModal = false
  @Input() collapse? = true
  @Input() product :any[]

  constructor() { }

  ngOnInit(): void {
  }

}
