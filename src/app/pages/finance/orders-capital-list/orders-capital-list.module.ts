import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersCapitalListRoutingModule } from "./orders-capital-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {OrdersCapitalListComponent} from "./orders-capital-list.component";
import {CopyrightComponentsModule} from "../../components/copyright/copyright-components.module";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzSelectModule} from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {MallComponentsModule} from "../../components/mall/mall-components.module";
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersCapitalListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzToolTipModule,
    CopyrightComponentsModule,
    NzDatePickerModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    NzPopconfirmModule,
    NzSelectModule,
    StarterModule,
    NzInputNumberModule,
    NzModalModule,
    NzRadioModule,
    NzSpinModule,
    NzSwitchModule,
    MallComponentsModule,
  ],
  declarations: [OrdersCapitalListComponent],
  exports: [OrdersCapitalListComponent]
})
export class OrdersCapitalListModule {
}
