import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FinanceRoutingModule} from "./finance.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FinanceRoutingModule
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class FinanceModule {
}

