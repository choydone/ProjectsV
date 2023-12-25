import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MerchantRoutingModule} from "./merchant.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MerchantRoutingModule
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class MerchantModule {
}

