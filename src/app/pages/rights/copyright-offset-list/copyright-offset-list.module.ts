import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CopyrightOffsetListRoutingModule} from "./copyright-offset-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {StarterModule} from "../../../starter/starter.module";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ErpPipesModule} from "../../../pipes/erp-pipes.module";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzListModule} from "ng-zorro-antd/list";
import {CopyrightOffsetListComponent} from "./copyright-offset-list.component";
import {CopyrightComponentsModule} from "../../components/copyright/copyright-components.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CopyrightOffsetListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzToolTipModule,
    NzDatePickerModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    NzSelectModule,
    StarterModule,
    NzPopconfirmModule,
    NzModalModule,
    ErpPipesModule,
    NzTypographyModule,
    NzMenuModule,
    NzDropDownModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSpinModule,
    NzListModule,
    CopyrightComponentsModule,
  ],
  declarations: [CopyrightOffsetListComponent],
  exports: [CopyrightOffsetListComponent]
})
export class CopyrightOffsetListModule {
}
