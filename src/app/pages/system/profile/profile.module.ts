import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfileRoutingModule} from "./profile-routing.module";
import {ProfileComponent} from "./profile.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfileRoutingModule,
    NzGridModule,
    NzCardModule,
    NzImageModule,
    NzTypographyModule,
    NzDividerModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,

  ],
  declarations: [ProfileComponent],
  exports: [ProfileComponent]
})
export class ProfileModule {
}
