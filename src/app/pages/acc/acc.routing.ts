import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'account_list', pathMatch: 'full',
  },
  {
    path: 'account_list',
    loadChildren: () => import('./account-list/account-list.module').then(m => m.AccountListModule),
    data: {keepLive: true}
  },
  {
    path: 'customer_list',
    loadChildren: () => import('./customer-list/customer-list.module').then(m => m.CustomerListModule),
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
export class AccRoutingModule {
}
