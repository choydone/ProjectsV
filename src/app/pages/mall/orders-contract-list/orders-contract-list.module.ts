import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersContractListRoutingModule } from "./orders-contract-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {StarterModule} from "../../../starter/starter.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {CopyrightComponentsModule} from "../../components/copyright/copyright-components.module";
import {OrdersContractListComponent} from "./orders-contract-list.component";
import {MallComponentsModule} from "../../components/mall/mall-components.module";
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        OrdersContractListRoutingModule,
        NzTableModule,
        NzSpaceModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzCheckboxModule,
        NzTagModule,
        NzToolTipModule,
        NzFormModule,
        NzSelectModule,
        NzDatePickerModule,
        StarterModule,
        NzModalModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzRadioModule,
        NzInputNumberModule,
        NzSpinModule,
        NzDescriptionsModule,
        NzSwitchModule,
        NzTypographyModule,
        NzPopoverModule,
        CopyrightComponentsModule,
        MallComponentsModule,
    ],
  declarations: [OrdersContractListComponent],
  exports: [OrdersContractListComponent]
})
export class OrdersContractListModule {
}
