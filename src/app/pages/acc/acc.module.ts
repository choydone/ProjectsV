import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AccRoutingModule} from "./acc.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AccRoutingModule
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class AccModule {
}

