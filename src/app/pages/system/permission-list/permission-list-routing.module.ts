import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionListComponent } from "./permission-list.component";

const routes: Routes = [
  {path: '', component: PermissionListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionListRoutingModule {
}
