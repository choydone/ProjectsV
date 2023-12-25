import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomerListRoutingModule} from "./customer-list-routing.module";
import {CustomerListComponent} from "./customer-list.component";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import {StarterModule} from "../../../starter/starter.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzTypographyModule} from "ng-zorro-antd/typography";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomerListRoutingModule,
    NzSpaceModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    StarterModule,
    NzModalModule,
    NzFormModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzInputModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzSelectModule,
    NzToolTipModule,
    NzImageModule,
    NzTypographyModule
  ],
  declarations: [CustomerListComponent],
  exports: [CustomerListComponent]
})
export class CustomerListModule {
}
