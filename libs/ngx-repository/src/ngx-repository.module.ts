import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RestProviderActionHandlers } from './shared/providers/rest-provider-action-handlers';
import { MockProviderActionHandlers } from './shared/providers/mock-provider-action-handlers';
import { DynamicRepository } from './shared/services/dynamic.repository';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
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
