import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {SharedModule} from "./shared/shared.module";
import {HttpHook} from './starter/shared/http-hook';
import {CodeEditorModule} from '@ngstack/code-editor';
import {RouteReuseStrategy} from "@angular/router";
import {AppReuseStrategy} from "./app-reuse-strategy";
import {ClipboardModule} from "ngx-clipboard";

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    NzDatePickerModule,
    ClipboardModule,
    CodeEditorModule.forRoot()
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHook,
      multi: true,
    }
    // { provide: RouteReuseStrategy, useClass: AppReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
