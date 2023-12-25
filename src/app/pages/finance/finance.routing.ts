import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'orders_capital_list', pathMatch: 'full',
  },
  {
    path: 'orders_capital_list',
    loadChildren: () => import('./orders-capital-list/orders-capital-list.module').then(m => m.OrdersCapitalListModule),
    data: {keepLive: true}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(manageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FinanceRoutingModule {
}
