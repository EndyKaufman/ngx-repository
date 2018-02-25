import { Routes } from '@angular/router';
import { MockDataPageComponent } from './mock-data-page.component';

export const MockDataPageRoutes: Routes = [
    {
        path: '',
        component: MockDataPageComponent,
        data: {
            name: 'mock-data',
            title: 'Mock data',
            visible: true
        },
        children: []
    }
];
