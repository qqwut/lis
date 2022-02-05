export const MENU_AT = [
    {
        label: 'Hierarchy',
        icon: 'pi pi-fw pi-align-left',
        items: [
            {
                label: 'Plan Description', icon: 'pi pi-fw pi-download',
                items: [
                    {
                        label: 'Plan Header/Details',
                        routerLink: ['/plan-header']
                    },
                    {
                        label: 'Plan Premium',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Commission',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Rates Maintenance',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan CPAYOe',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Dividend',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Cash Value',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan ETI/RPU',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Maturity Value',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Maturity/Expiry Date',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan Table Value',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Plan - Policy Statistic',
                        routerLink: ['/plan']
                    },
                ]
            },
            {
                label: 'Rates Setup',
                icon: 'pi pi-fw pi-info-circle',
                routerLink: ['/plan'],
                items: [
                    {
                        label: 'Rate Header Table(RH)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Rate Load Table(RTBL)',
                        routerLink: ['/plan']

                    },
                    {
                        label: 'Unit Value Table(UVAL)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Interest Rate Table(IR)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'PCNT Table(CC)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'MxDx Table (MD)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'Edit Table (EDIT)',
                        routerLink: ['/plan']
                    },
                    {
                        label: 'ABVAL Table (TABVAL)',
                        routerLink: ['/plan']
                    }
                ]
            },
            {
                label: 'Create',
                icon: 'pi pi-fw pi-info-circle',
                routerLink: ['/plan'],
                items: [
                    {
                        label: 'Whole Life'
                    },
                    {
                        label: 'Endowment'
                    },
                    {
                        label: 'Annuity'
                    },
                    {
                        label: 'Pension'
                    }
                ]
            },
        ]
    }
];
