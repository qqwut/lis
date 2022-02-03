import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '@app-shared/services/breadcrumb/breadcrumb.service';
import { AppComponent } from '@app-root/app.component';
import { AppMainComponent } from '@app-root/app.main.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy {
  subscription: Subscription;
  items: MenuItem[];
  tieredItems = []
  breadcrumbItems = [
    { label: 'Electronics' },
    { label: 'Computer' },
    { label: 'Notebook' },
    { label: 'Accessories' },
    { label: 'Backpacks' },
    { label: 'Item' }
  ];

  constructor(
    public breadcrumbService: BreadcrumbService,
    public appMain: AppMainComponent,
    public app: AppComponent
  ) {
    this.subscription = breadcrumbService.itemsHandler
      .subscribe(response => {
        this.items = response;
      });
    // this.tieredItems = [
    //   {
    //     label: 'Home',
    //   },
    //   {
    //     label: 'Search Plan',
    //     items: [
    //       {
    //         label: 'View',
    //         icon: 'pi pi-fw pi-list'
    //       },
    //       {
    //         label: 'Search',
    //         icon: 'pi pi-fw pi-search'
    //       }

    //     ]
    //   },
    //   {
    //     label: 'Instructions',
    //   },
    //   {
    //     label: 'Terms and Conditions'
    //   },
    //   {
    //     label: 'Session Info'
    //   },
    //   {
    //     label: 'Application Info'
    //   },
    //   {
    //     label: 'About Program'
    //   }
    // ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
