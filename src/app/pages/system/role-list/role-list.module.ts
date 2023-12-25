import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoleListRoutingModule} from "./role-list-routing.module";
import {RoleListComponent} from "./role-list.component";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzModalModule } from "ng-zorro-antd/modal";
import {StarterModule} from "../../../starter/starter.module";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTagModule} from "ng-zorro-antd/tag";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RoleListRoutingModule,
        NzSpaceModule,
        NzInputModule,
        NzButtonModule,
        NzCheckboxModule,
        NzIconModule,
        NzTableModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzFormModule,
        NzSwitchModule,
        NzModalModule,
        StarterModule,
        NzCardModule,
        NzTagModule
    ],
  declarations: [RoleListComponent],
  exports: [RoleListComponent]
})
export class RoleListModule {
}
