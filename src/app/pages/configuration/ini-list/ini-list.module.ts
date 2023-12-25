import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IniListRoutingModule} from "./ini-list-routing.module";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzPopconfirmModule } from "ng-zorro-antd/popconfirm";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { StarterModule } from "../../../starter/starter.module";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import {IniListComponent} from "./ini-list.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzTypographyModule} from "ng-zorro-antd/typography";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IniListRoutingModule,
    NzButtonModule,
    NzTableModule,
    NzSpaceModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NzDividerModule,
    StarterModule,
    NzToolTipModule,
    NzRadioModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzCardModule,
    NzTagModule,
    NzAlertModule,
    NzTypographyModule
  ],
  declarations: [IniListComponent],
  exports: [IniListComponent]
})
export class IniListModule {
}
