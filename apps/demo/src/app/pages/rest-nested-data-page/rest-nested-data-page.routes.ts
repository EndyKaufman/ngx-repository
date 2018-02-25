import { Routes } from '@angular/router';
import { RestNestedDataPageComponent } from './rest-nested-data-page.component';

export const RestNestedDataPageRoutes: Routes = [
    {
        path: '',
        component: RestNestedDataPageComponent,
        data: {
            name: 'rest-nested-data',
            title: 'Rest nested data',
            visible: true
        },
        children: []
    }
];
