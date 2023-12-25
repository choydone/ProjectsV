import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfigurationRoutingModule } from "./configuration.routing";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ConfigurationRoutingModule
  ],
  declarations: [
  ],
  providers: [],
  exports: []
})
export class ConfigurationModule {
}
