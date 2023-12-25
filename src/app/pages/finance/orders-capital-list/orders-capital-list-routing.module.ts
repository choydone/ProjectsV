import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrdersCapitalListComponent} from "./orders-capital-list.component";

const routes: Routes = [
  {path: '', component: OrdersCapitalListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersCapitalListRoutingModule {
}
