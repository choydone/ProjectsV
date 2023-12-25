import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionListRoutingModule } from "./permission-list-routing.module";
import { PermissionListComponent } from "./permission-list.component";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {StarterModule} from "../../../starter/starter.module";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        PermissionListRoutingModule,
        NzTreeModule,
        NzLayoutModule,
        NzInputModule,
        NzIconModule,
        NzSpaceModule,
        NzButtonModule,
        NzTableModule,
        NzAlertModule,
        StarterModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzModalModule,
        NzFormModule,
        NzTreeSelectModule,
        NzSwitchModule,
        NzCheckboxModule,
        NzToolTipModule
    ],
  declarations: [PermissionListComponent],
  exports: [PermissionListComponent]
})
export class PermissionListModule {
}
