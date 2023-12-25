import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IprListComponent} from "./ipr-list.component";

const routes: Routes = [
  {path: '', component: IprListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IprListRoutingModule {
}
