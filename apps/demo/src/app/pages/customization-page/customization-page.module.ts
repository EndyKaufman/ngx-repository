import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '@ngx-docs/example';
import { GroupsGridModule } from '../../grids/groups-grid/groups-grid.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomizationPageComponent } from './customization-page.component';
import { CustomizationPageRoutes } from './customization-page.routes';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    GroupsGridModule.forRoot(),
    RouterModule.forChild(CustomizationPageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [CustomizationPageComponent]
})
export class CustomizationPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CustomizationPageModule,
      providers: []
    };
  }
}
