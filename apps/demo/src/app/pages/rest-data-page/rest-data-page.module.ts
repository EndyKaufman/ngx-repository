import { NgModule } from '@angular/core';
import { RestDataPageComponent } from './rest-data-page.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UsersGridModule } from '../../grids/users-grid/users-grid.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { RestDataPageRoutes } from './rest-data-page.routes';
import { DocsExampleModule } from '@ngx-docs/example';
import { MatIconModule } from '@angular/material/icon';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

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
export class RestDataPageModule { }
