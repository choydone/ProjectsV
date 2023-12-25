import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserListRoutingModule} from "./user-list-routing.module";
import {UserListComponent} from "./user-list.component";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzSelectModule } from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserListRoutingModule,
    NzInputModule,
    NzTableModule,
    NzSpaceModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzFormModule,
    NzSwitchModule,
    NzModalModule,
    NzSelectModule,
    StarterModule
  ],
  declarations: [UserListComponent],
  exports: [UserListComponent]
})
export class UserListModule {
}
