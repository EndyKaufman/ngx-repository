import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MockProviderActionHandlers } from './providers/mock-provider-action-handlers';
import { RestProviderActionHandlers } from './providers/rest-provider-action-handlers';
import { DynamicRepository } from './services/dynamic.repository';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        RestProviderActionHandlers,
        MockProviderActionHandlers,
        DynamicRepository
    ],
})
export class NgxRepositoryModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxRepositoryModule,
            providers: []
        };
    }
}
