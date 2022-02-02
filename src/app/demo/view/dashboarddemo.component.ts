import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../app.breadcrumb.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboarddemo.scss', './tabledemo.scss'],
})
export class DashboardDemoComponent implements OnInit {


    tieredItems: MenuItem[];
    breadcrumbItems = [
        { label: 'Plan Header' },
        { label: 'Details' }
    ];
    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Dashboard', routerLink: ['/'] }
        ]);
    }

    ngOnInit() {
    }
}
