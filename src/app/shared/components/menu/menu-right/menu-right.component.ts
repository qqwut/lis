import { Component } from '@angular/core'
import { SelectItem } from 'primeng/api'
import { AppMainComponent } from '@app-root/app.main.component'

@Component({
  selector: 'app-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.scss'],
})
export class MenuRightComponent {
  amount: SelectItem[]

  selectedAmount: any

  constructor(public appMain: AppMainComponent) {
    this.amount = [
      { label: '*****24', value: { id: 1, name: '*****24', code: 'A1' } },
      { label: '*****75', value: { id: 2, name: '*****75', code: 'A2' } },
    ]
  }
}
