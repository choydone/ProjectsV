import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AutomaticCompileComponent} from "./automatic-compile.component";

const routes: Routes = [
  {path: '', component: AutomaticCompileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomaticCompileRoutingModule {
}
