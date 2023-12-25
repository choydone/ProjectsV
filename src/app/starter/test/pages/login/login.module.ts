import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginRoutingModule} from "./login-routing.module";
import {LoginComponent} from "./login.component";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoginRoutingModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
}
