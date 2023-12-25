import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemRoutingModule } from "./mall.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SystemRoutingModule
  ],
  declarations: [
  ],
  providers: [],
  exports: []
})
export class MallModule {
}

