import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessListRoutingModule } from "./process-list-routing.module";
import { ProcessListComponent } from "./process-list.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzInputModule } from "ng-zorro-antd/input";
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
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTagModule } from "ng-zorro-antd/tag";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ProcessListRoutingModule,
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
        NzSelectModule,
        NzTagModule

    ],
  declarations: [ProcessListComponent],
  exports: [ProcessListComponent]
})
export class ProcessListModule {
}
