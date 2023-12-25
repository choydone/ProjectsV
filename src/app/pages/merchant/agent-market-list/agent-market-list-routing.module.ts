import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentMarketListComponent} from "./agent-market-list.component";

const routes: Routes = [
  {path: '', component: AgentMarketListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentMarketListRoutingModule {
}
