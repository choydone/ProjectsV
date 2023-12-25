import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IniListComponent} from "./ini-list.component";

const routes: Routes = [
  {path: '', component: IniListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IniListRoutingModule {
}
