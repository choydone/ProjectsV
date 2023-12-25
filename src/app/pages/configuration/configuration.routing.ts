import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'process_list', pathMatch: 'full',
  },
  {
    path: 'code_design_list',
    loadChildren: () => import('./code-design-list/code-design-list.module').then(m => m.CodeDesignListModule),
    data: {keepLive: true}
  },
  {
    path: 'param_list',
    loadChildren: () => import('./param-list/param-list.module').then(m => m.ParamListModule),
    data: {keepLive: true}
  },
  {
    path: 'process_list',
    loadChildren: () => import('./process-list/process-list.module').then(m => m.ProcessListModule),
    data: {keepLive: true}
  },
  {
    path: 'ini_list',
    loadChildren: () => import('./ini-list/ini-list.module').then(m => m.IniListModule),
    data: {keepLive: true}
  },
  {
    path: 'doc_list/:type',
    loadChildren: () => import('./doc-list/doc-list.module').then(m => m.DocListModule),
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
// @ts-ignore
export class ConfigurationRoutingModule {
}
