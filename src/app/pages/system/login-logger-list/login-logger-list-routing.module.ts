import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginLoggerListComponent} from "./login-logger-list.component";

const routes: Routes = [
  {path: '', component: LoginLoggerListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginLoggerListRoutingModule {
}
