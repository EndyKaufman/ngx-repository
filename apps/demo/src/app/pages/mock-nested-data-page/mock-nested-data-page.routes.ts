import { Routes } from '@angular/router';
import { MockNestedDataPageComponent } from './mock-nested-data-page.component';

export const MockNestedDataPageRoutes: Routes = [
    {
        path: '',
        component: MockNestedDataPageComponent,
        data: {
            name: 'mock-nested-data',
            title: 'Mock nested data',
            visible: true
        },
        children: []
    }
];
