import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeDesignListComponent } from "./code-design-list.component";

const routes: Routes = [
  {path: '', component: CodeDesignListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodeDesignListRoutingModule {
}
