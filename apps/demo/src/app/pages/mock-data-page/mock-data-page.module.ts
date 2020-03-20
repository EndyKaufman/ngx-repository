import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UsersGridModule } from '../../grids/users-grid/users-grid.module';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { MockDataPageComponent } from './mock-data-page.component';
import { MockDataPageRoutes } from './mock-data-page.routes';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';

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
export class MockDataPageModule {}
