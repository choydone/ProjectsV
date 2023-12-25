import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrdersCopyrightListComponent} from "./orders-copyright-list.component";

const routes: Routes = [
  {path: '', component: OrdersCopyrightListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersCopyrightListRoutingModule {
}
