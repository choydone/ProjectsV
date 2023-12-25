import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CopyrightCheckinListComponent} from "./copyright-checkin-list.component";

const routes: Routes = [
  {path: '', component: CopyrightCheckinListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyrightCheckinListRoutingModule {
}
