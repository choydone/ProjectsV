import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'agent_list', pathMatch: 'full',
  },
  {
    path: 'agent_list',
    loadChildren: () => import('./agent-list/agent-list.module').then(m => m.AgentListModule),
    data: {keepLive: true}
  },
  {
    path: 'agent_market_list',
    loadChildren: () => import('./agent-market-list/agent-market-list.module').then(m => m.AgentMarketListModule),
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
export class MerchantRoutingModule {
}
