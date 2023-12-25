import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{path: '', pathMatch: 'full', redirectTo: '/login'},*/
  {path: '', loadChildren: () => import('./pages/layout/layout.module').then(m => m.LayoutModule)},
  {path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
