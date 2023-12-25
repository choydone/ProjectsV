import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginLoggerListRoutingModule } from "./login-logger-list-routing.module";
import {LoginLoggerListComponent} from "./login-logger-list.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTagModule} from "ng-zorro-antd/tag";
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoginLoggerListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzTagModule,
  ],
  declarations: [LoginLoggerListComponent],
  exports: [LoginLoggerListComponent]
})
export class LoginLoggerListModule {
}
