import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SourceTabsModule } from '../../others/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutes } from './home-page.routes';
import { DocsExampleModule } from '../../others/docs-example/docs-example.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    MarkdownModule.forChild(),
    RouterModule.forChild(HomePageRoutes),
    DocsExampleModule.forRoot(),
    SourceTabsModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomePageModule,
      providers: []
    };
  }
}
