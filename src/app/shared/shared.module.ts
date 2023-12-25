import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {AdminModule} from "./admin/admin.module";
import {MallModule} from "./mall/mall.module";
import {MerchantModule} from "./merchant/merchant.module";
import {WorksheetModule} from "./worksheet/worksheet.module";
import {IprModule} from "./ipr/ipr.module";
import {AccModule} from "./acc/acc.module";
import {FinanceModule} from "./finance/finance.module";

@NgModule({
  imports: [
    CommonModule,
    NzMessageModule,
    AdminModule,
    MallModule,
    MerchantModule,
    WorksheetModule,
    IprModule,
    AccModule,
    FinanceModule
  ],
  providers: [],
  declarations: []
})

export class SharedModule {
}
