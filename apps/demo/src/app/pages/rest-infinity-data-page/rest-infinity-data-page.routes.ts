import { Routes } from '@angular/router';
import { RestInfinityDataPageComponent } from './rest-infinity-data-page.component';

export const RestInfinityDataPageRoutes: Routes = [
    {
        path: '',
        component: RestInfinityDataPageComponent,
        data: {
            name: 'rest-infinity-data',
            title: 'Rest infinity data',
            visible: true
        },
        children: []
    }
];
