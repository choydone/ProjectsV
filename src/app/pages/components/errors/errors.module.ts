import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Err404Component} from "./err404/err404.component";
import {Err403Component} from "./err403/err403.component";
import {Err500Component} from "./err500/err500.component";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzButtonModule} from "ng-zorro-antd/button";
import {BlankPageComponent} from "./blank-page/blank-page.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzResultModule,
    NzButtonModule,
  ],
  providers: [],
  declarations: [Err404Component, Err403Component, Err500Component, BlankPageComponent],
  exports: [Err404Component, Err403Component, Err500Component, BlankPageComponent]
})
export class ErrorsModule {
}
