import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UsersGridModule } from '../../grids/users-grid/users-grid.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { RestDataPageComponent } from './rest-data-page.component';
import { RestDataPageRoutes } from './rest-data-page.routes';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    UsersGridModule.forRoot(),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule.forChild(RestDataPageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  entryComponents: [RestDataPageComponent],
  exports: [RestDataPageComponent],
  declarations: [RestDataPageComponent]
})
export class RestDataPageModule {}
