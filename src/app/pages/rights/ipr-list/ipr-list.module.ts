import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IprListRoutingModule} from "./ipr-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {IprListComponent} from "./ipr-list.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzSelectModule} from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {CopyrightComponentsModule} from "../../components/copyright/copyright-components.module";
import {NzModalModule} from "ng-zorro-antd/modal";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IprListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzToolTipModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    NzPopconfirmModule,
    NzSelectModule,
    StarterModule,
    NzDatePickerModule,
    NzTimelineModule,
    NzTypographyModule,
    CopyrightComponentsModule,
    NzModalModule,

  ],
  declarations: [IprListComponent],
  exports: [IprListComponent]
})
export class IprListModule {
}
