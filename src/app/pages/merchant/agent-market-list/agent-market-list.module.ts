import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentMarketListRoutingModule } from "./agent-market-list-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {AgentMarketListComponent} from "./agent-market-list.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {StarterModule} from "../../../starter/starter.module";
import {ProductListModule} from "../../mall/product-list/product-list.module";
import {AutocompleteComponentsModule} from "../../components/autocomplete/autocomplete-components.module";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzSelectModule} from "ng-zorro-antd/select";
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgentMarketListRoutingModule,
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
    NzModalModule,
    NzPopconfirmModule,
    StarterModule,
    ProductListModule,
    AutocompleteComponentsModule,
    NzDescriptionsModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSelectModule,
  ],
  declarations: [AgentMarketListComponent],
  exports: [AgentMarketListComponent]
})
export class AgentMarketListModule {
}
