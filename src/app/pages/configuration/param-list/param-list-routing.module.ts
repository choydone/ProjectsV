import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ParamListComponent } from "./param-list.component";

const routes: Routes = [
  {path: '', component: ParamListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParamListRoutingModule {
}
