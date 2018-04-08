import { Routes } from '@angular/router';
import { CustomizationPageRoutes } from './pages/customization-page/customization-page.routes';
import { HomePageRoutes } from './pages/home-page/home-page.routes';
import { MockDataPageRoutes } from './pages/mock-data-page/mock-data-page.routes';
import { MockNestedDataPageRoutes } from './pages/mock-nested-data-page/mock-nested-data-page.routes';
import { RestDataPageRoutes } from './pages/rest-data-page/rest-data-page.routes';
import { RestNestedDataPageRoutes } from './pages/rest-nested-data-page/rest-nested-data-page.routes';

export const AppRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: './pages/home-page/home-page.module#HomePageModule',
        data: HomePageRoutes[0].data
    },
    {
        path: 'mock-data',
        loadChildren: './pages/mock-data-page/mock-data-page.module#MockDataPageModule',
        data: MockDataPageRoutes[0].data
    },
    {
        path: 'rest-data',
        loadChildren: './pages/rest-data-page/rest-data-page.module#RestDataPageModule',
        data: RestDataPageRoutes[0].data
    },
    {
        path: 'mock-nested-data',
        loadChildren: './pages/mock-nested-data-page/mock-nested-data-page.module#MockNestedDataPageModule',
        data: MockNestedDataPageRoutes[0].data
    },
    {
        path: 'rest-nested-data',
        loadChildren: './pages/rest-nested-data-page/rest-nested-data-page.module#RestNestedDataPageModule',
        data: RestNestedDataPageRoutes[0].data
    },
    {
        path: 'customization',
        loadChildren: './pages/customization-page/customization-page.module#CustomizationPageModule',
        data: CustomizationPageRoutes[0].data
    },
    {
        path: 'github',
        redirectTo: 'https://github.com/EndyKaufman/ngx-repository',
        data: {
            name: 'github',
            title: 'github',
            svgIcon: `github-circle`,
            visible: true
        }
    },
    {
        path: '**',
        redirectTo: 'home'
    },
];
