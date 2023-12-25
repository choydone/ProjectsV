import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutomaticCompileRoutingModule} from "./automatic-compile-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {ErrorsModule} from "../../components/errors/errors.module";
import {ErpPipesModule} from "../../../pipes/erp-pipes.module";
import {AutomaticCompileComponent} from "./automatic-compile.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzListModule} from "ng-zorro-antd/list";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AutomaticCompileRoutingModule,
    NzTypographyModule,
    NzWaveModule,
    NzCardModule,
    NzPopconfirmModule,

  ],
  declarations: [AutomaticCompileComponent],
  exports: [AutomaticCompileComponent]
})
export class AutomaticCompileModule {
}
