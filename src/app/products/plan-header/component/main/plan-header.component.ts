import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import Swal from 'sweetalert2'
import { IProductPlanHeader, IResPlanHeaderItem, TPD, TPH } from '../../interface/TPD'
import { PlanHeaderService } from '../../service/plan-header.service'

@Component({
  selector: 'app-plan-header',
  templateUrl: './plan-header.component.html',
  styleUrls: ['./plan-header.component.scss'],
})
export class PlanHeaderComponent implements OnInit {
  product: TPH[]
  items: MenuItem[]
  activeItem: MenuItem
  displayModal = false
  collapse = true

  constructor(private planHeaderService: PlanHeaderService) {}

  ngOnInit(): void {
    this.getProduct()
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home' },
      { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
    ]
    this.activeItem = this.items[0]
  }

  getProduct() {
    this.planHeaderService.getProduct().subscribe({
      next: (response: IResPlanHeaderItem) => {
        this.product = response.data.tph
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          text: error.message,
        })
      },
    })
  }

  onDetail() {
    this.displayModal = true
  }
}
