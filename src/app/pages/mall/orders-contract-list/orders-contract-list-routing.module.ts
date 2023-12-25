import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrdersContractListComponent} from "./orders-contract-list.component";

const routes: Routes = [
  {path: '', component: OrdersContractListComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersContractListRoutingModule {
}
