import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'automatic_compile', pathMatch: 'full',
  },
  {
    path: 'automatic_compile',
    loadChildren: () => import('./automatic-compile/automatic-compile.module').then(m => m.AutomaticCompileModule),
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
export class CodeupRoutingModule  {
}
