import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMainComponent } from './app.main.component';
import { MenuService } from './shared/services/menu/menu.service';
import { MENU_AT } from './shared/constants/menu/menu.data';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnDestroy {

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
