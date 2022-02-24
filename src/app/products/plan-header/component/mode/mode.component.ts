import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.scss'],
})
export class ModeComponent implements OnInit {
  displayModal = false
  @Input() collapseMode? = true
  @Input() product: any[]

  constructor() {}

  ngOnInit(): void {}
}
