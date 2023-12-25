import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountListRoutingModule} from "./account-list-routing.module";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {StarterModule} from "../../../starter/starter.module";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzListModule} from "ng-zorro-antd/list";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import { ComponentsModule } from "../../components/components.module";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { LayoutModule } from "../../layout/layout.module";
import { NzTagModule } from "ng-zorro-antd/tag";
import { AccountListComponent } from "./account-list.component";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import {AutocompleteComponentsModule} from "../../components/autocomplete/autocomplete-components.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AccountListRoutingModule,
    NzSpaceModule,
    NzButtonModule,
    NzTableModule,
    StarterModule,
    NzToolTipModule,
    NzDividerModule,
    NzModalModule,
    NzIconModule,
    NzInputModule,
    NzCheckboxModule,
    NzImageModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzRadioModule,
    NzTypographyModule,
    NzDescriptionsModule,
    NzListModule,
    NzCardModule,
    NzAvatarModule,
    NzAlertModule,
    NzPopconfirmModule,
    ComponentsModule,
    NzTabsModule,
    LayoutModule,
    NzTagModule,
    NzSwitchModule,
    AutocompleteComponentsModule
  ],
  declarations: [AccountListComponent],
  exports: [AccountListComponent]
})
export class AccountListModule {
}
