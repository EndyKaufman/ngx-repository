import { Routes } from '@angular/router';
import { RestDataPageComponent } from './rest-data-page.component';

export const RestDataPageRoutes: Routes = [
    {
        path: '',
        component: RestDataPageComponent,
        data: {
            name: 'rest-data',
            title: 'Rest data',
            visible: true
        },
        children: []
    }
];
