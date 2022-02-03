import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMainComponent } from '@app-root/app.main.component';
import { MenuService } from '@app-shared/services/menu/menu.service';
import { MENU_AT } from '@app-shared/constants/menu/menu.data';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnDestroy {

  model: any[] = [];
  subscription: Subscription;

  constructor(
    public appMain: AppMainComponent,
    public menuService: MenuService
  ) {
    // this.menuService.setItems(MENU_AT)
    this.subscription = this.menuService.itemsHandler$
      .subscribe(response => {
        this.model = response;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
