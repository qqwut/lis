import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-header-divider',
  templateUrl: './header-divider.component.html',
  styleUrls: ['./header-divider.component.scss'],
})
export class HeaderDividerComponent implements OnInit {
  @Input() collapse?: boolean
  @Input() text: string
  @Output() onCollapse? = new EventEmitter<boolean>(false)
  @Input() textModal?: string
  @Output() onModal? = new EventEmitter<Event>()
  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.collapse = !this.collapse
    this.onCollapse.emit(this.collapse)
  }

  onClickModal(event: Event) {
    this.onModal.emit(event)
  }
}
