import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductListRoutingModule} from "./product-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {ProductListComponent} from "./product-list.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {StarterModule} from "../../../starter/starter.module";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {AutocompleteComponentsModule} from "../../components/autocomplete/autocomplete-components.module";
import {PreRegularListComponent} from "./components/pre-regular-list/pre-regular-list.component";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzTimelineModule} from "ng-zorro-antd/timeline";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductListRoutingModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzToolTipModule,
    NzCardModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    NzModalModule,
    NzPopconfirmModule,
    NzSwitchModule,
    StarterModule,
    NzDatePickerModule,
    NzInputNumberModule,
    AutocompleteComponentsModule,
    NzDescriptionsModule,
    NzTypographyModule,
    NzTimelineModule,

  ],
  declarations: [ProductListComponent, PreRegularListComponent],
  exports: [ProductListComponent, PreRegularListComponent]
})
export class ProductListModule {
}
