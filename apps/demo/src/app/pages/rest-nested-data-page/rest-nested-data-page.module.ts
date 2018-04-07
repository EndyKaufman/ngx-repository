import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DocsExampleModule } from '@ngx-docs/example';
import { GroupsGridModule } from '../../grids/groups-grid/groups-grid.module';
import { UsersWithGroupsGridModule } from '../../grids/users-with-groups-grid/users-with-groups-grid.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { RestNestedDataPageComponent } from './rest-nested-data-page.component';
import { RestNestedDataPageRoutes } from './rest-nested-data-page.routes';

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
