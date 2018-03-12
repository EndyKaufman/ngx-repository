import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ErrorHandler } from '@angular/core';
import { CustomErrorHandler } from './shared/exceptions/error.handler';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from './others/navbar/navbar.module';
import { MAT_DIALOG_DEFAULT_OPTIONS, ErrorStateMatcher } from '@angular/material';
import { MyErrorStateMatcher } from './shared/utils/my-error-state-matcher';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AppRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MessageBoxModule } from './others/message-box/message-box.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule.forRoot(),
    MessageBoxModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'demo' }),
    NavbarModule.forRoot(),
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: MyErrorStateMatcher },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
