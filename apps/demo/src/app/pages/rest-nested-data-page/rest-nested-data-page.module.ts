import { NgModule } from '@angular/core';
import { RestNestedDataPageComponent } from './rest-nested-data-page.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UsersWithGroupsGridModule } from '../../grids/users-with-groups-grid/users-with-groups-grid.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { RestNestedDataPageRoutes } from './rest-nested-data-page.routes';
import { DocsExampleModule } from '@ngx-docs/example';
import { MatIconModule } from '@angular/material/icon';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupsGridModule } from '../../grids/groups-grid/groups-grid.module';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    UsersWithGroupsGridModule.forRoot(),
    GroupsGridModule.forRoot(),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule.forChild(RestNestedDataPageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  entryComponents: [RestNestedDataPageComponent],
  exports: [RestNestedDataPageComponent],
  declarations: [RestNestedDataPageComponent]
})
export class RestNestedDataPageModule { }
