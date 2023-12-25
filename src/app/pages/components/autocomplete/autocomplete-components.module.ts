import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzListModule} from "ng-zorro-antd/list";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {StarterModule} from "../../../starter/starter.module";
import {AccountAutocompleteComponent} from "./account-autocomplete/account-autocomplete.component";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzInputModule} from "ng-zorro-antd/input";
import {CodeDesignAutocompleteComponent} from "./code-design-autocomplete/code-design-autocomplete.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzButtonModule,
    NzModalModule,
    NzAlertModule,
    StarterModule,
    NzListModule,
    NzGridModule,
    NzCardModule,
    NzPopconfirmModule,
    NzToolTipModule,
    NzIconModule,
    NzSpaceModule,
    NzTagModule,
    NzTimelineModule,
    NzTypographyModule,
    NzAutocompleteModule,
    NzInputModule,
  ],
  providers: [],
  declarations: [AccountAutocompleteComponent, CodeDesignAutocompleteComponent],
  exports: [AccountAutocompleteComponent, CodeDesignAutocompleteComponent]
})
export class AutocompleteComponentsModule {
}
