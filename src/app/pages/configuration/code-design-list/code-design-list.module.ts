import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CodeDesignListRoutingModule} from "./code-design-list-routing.module";
import { CodeDesignListComponent } from "./code-design-list.component";
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
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CodeDesignListRoutingModule,
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
    NzSelectModule

  ],
  declarations: [CodeDesignListComponent],
  exports: [CodeDesignListComponent]
})
export class CodeDesignListModule {
}
