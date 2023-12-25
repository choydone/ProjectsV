import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoggerListComponent} from "./logger-list.component";

const routes: Routes = [
  {path: '', component: LoggerListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggerListRoutingModule {
}
