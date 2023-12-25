import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {CodeupRoutingModule} from "./codeup.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CodeupRoutingModule,
  ],
  declarations: [
  ],
  providers: [],
  exports: [

  ]
})
export class CodeupModule {
}

