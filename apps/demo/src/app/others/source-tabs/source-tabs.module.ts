import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PrismModule } from '@ngx-prism/core';
import { SharedModule } from '../../shared/shared.module';
import { SourceTabsComponent } from './source-tabs.component';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    PrismModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  entryComponents: [SourceTabsComponent],
  exports: [SourceTabsComponent],
  declarations: [SourceTabsComponent]
})
export class SourceTabsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SourceTabsModule,
      providers: []
    };
  }
}
