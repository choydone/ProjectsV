import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrdersCopyrightListRoutingModule} from "./orders-copyright-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {OrdersCopyrightListComponent} from "./orders-copyright-list.component";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzImageModule} from "ng-zorro-antd/image";
import {CopyrightComponentsModule} from "../../components/copyright/copyright-components.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersCopyrightListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzToolTipModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    StarterModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzModalModule,
    NzSwitchModule,
    NzTimelineModule,
    NzTypographyModule,
    NzImageModule,
    CopyrightComponentsModule,

  ],
  declarations: [OrdersCopyrightListComponent],
  exports: [OrdersCopyrightListComponent]
})
export class OrdersCopyrightListModule {
}
