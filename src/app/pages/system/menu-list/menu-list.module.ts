import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuListRoutingModule } from "./menu-list-routing.module";
import { MenuListComponent } from "./menu-list.component";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTreeModule } from "ng-zorro-antd/tree";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzSelectModule } from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MenuListRoutingModule,
        NzInputModule,
        NzTreeModule,
        NzFormModule,
        NzSpaceModule,
        NzButtonModule,
        NzLayoutModule,
        NzPopconfirmModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzTypographyModule,
        NzDropDownModule,
        NzAlertModule,
        NzSwitchModule,
        NzInputNumberModule,
        NzSelectModule,
        StarterModule,
        NzCheckboxModule,
        NzModalModule,
        NzTreeSelectModule,
        NzToolTipModule
    ],
  declarations: [MenuListComponent],
  exports: [MenuListComponent]
})
export class MenuListModule {
}
