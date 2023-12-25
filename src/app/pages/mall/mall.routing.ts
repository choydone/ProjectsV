import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'user_list', pathMatch: 'full',
  },
  {
    path: 'orders_list',
    loadChildren: () => import('./orders-list/orders-list.module').then(m => m.OrdersListModule),
    data: {keepLive: true}
  },
  {
    path: 'orders_copyright_list',
    loadChildren: () => import('./orders-copyright-list/orders-copyright-list.module').then(m => m.OrdersCopyrightListModule),
    data: {keepLive: true}
  },
  {
    path: 'product_list',
    loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule),
    data: {keepLive: true}
  },
  {
    path: 'orders_contract_list',
    loadChildren: () => import('./orders-contract-list/orders-contract-list.module').then(m => m.OrdersContractListModule),
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
export class SystemRoutingModule {
}
