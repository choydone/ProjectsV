import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {BlankPageComponent} from "../components/errors/blank-page/blank-page.component";
import {Err404Component} from "../components/errors/err404/err404.component";
import {Err500Component} from "../components/errors/err500/err500.component";
import {Err403Component} from "../components/errors/err403/err403.component";

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: '/welcome', pathMatch: 'full'},
      {path: 'blank_page/:index', component: BlankPageComponent},
      {path: '404', component: Err404Component},
      {path: '403', component: Err403Component},
      {path: '500', component: Err500Component},
      {
        path: 'welcome', loadChildren: () => import('../welcome/welcome.module').then(m => m.WelcomeModule),
        data: {routeKeep: true}
      },
      {
        path: 'system', loadChildren: () => import('../system/system.module').then(m => m.SystemModule),
        data: {routeKeep: true}
      },
      {
        path: 'configuration',
        loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule),
        data: {routeKeep: true}
      },
      {
        path: 'rights',
        loadChildren: () => import('../rights/rights.module').then(m => m.RightsModule),
        data: {routeKeep: true}
      },
      {
        path: 'mall',
        loadChildren: () => import('../mall/mall.module').then(m => m.MallModule),
        data: {routeKeep: true}
      },
      {
        path: 'acc',
        loadChildren: () => import('../acc/acc.module').then(m => m.AccModule),
        data: {routeKeep: true}
      },
      {
        path: 'merchant',
        loadChildren: () => import('../merchant/merchant.module').then(m => m.MerchantModule),
        data: {routeKeep: true}
      },
      {
        path: 'finance',
        loadChildren: () => import('../finance/finance.module').then(m => m.FinanceModule),
        data: {routeKeep: true}
      },
      {
        path: 'codeup',
        loadChildren: () => import('../codeup/codeup.module').then(m => m.CodeupModule),
        data: {routeKeep: true}
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(layoutRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LayoutRoutingModule {
}
