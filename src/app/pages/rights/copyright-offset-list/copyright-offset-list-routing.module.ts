import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CopyrightOffsetListComponent} from "./copyright-offset-list.component";

const routes: Routes = [
  {path: '', component: CopyrightOffsetListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyrightOffsetListRoutingModule {
}
