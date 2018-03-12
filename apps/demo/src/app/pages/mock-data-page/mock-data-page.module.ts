import { NgModule } from '@angular/core';
import { MockDataPageComponent } from './mock-data-page.component';
import { UsersGridModule } from '../../grids/users-grid/users-grid.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MockDataPageRoutes } from './mock-data-page.routes';
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
    RouterModule.forChild(MockDataPageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  entryComponents: [MockDataPageComponent],
  exports: [MockDataPageComponent],
  declarations: [MockDataPageComponent]
})
export class MockDataPageModule { }
