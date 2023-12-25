import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CopyrightDatasetListComponent} from "./copyright-dataset-list.component";

const routes: Routes = [
  {path: '', component: CopyrightDatasetListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyrightDatasetListRoutingModule {
}
