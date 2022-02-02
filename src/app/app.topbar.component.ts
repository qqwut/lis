import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { BreadcrumbService } from './app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];
    tieredItems = [
        {
            label: 'Home',
            // icon: 'pi pi-fw pi-table',
        },
        {
            label: 'Search Plan',
            // icon: 'pi pi-fw pi-shopping-cart',
            items: [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-list'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-search'
                }

            ]
        },
        {
            label: 'Instructions',
        },
        {
            label: 'Terms and Conditions'
        },
        {
            label: 'Session Info'
        },
        {
            label: 'Application Info'
        },
        {
            label: 'About Program'
        }
        // { separator: true },
        // {
        //     label: 'Quit',
        //     icon: 'pi pi-fw pi-sign-out'
        // }
    ];
    breadcrumbItems = [
        { label: 'Electronics' },
        { label: 'Computer' },
        { label: 'Notebook' },
        { label: 'Accessories' },
        { label: 'Backpacks' },
        { label: 'Item' }
    ];

    constructor(public breadcrumbService: BreadcrumbService, public app: AppComponent, public appMain: AppMainComponent) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
