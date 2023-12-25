import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'user_list', pathMatch: 'full',
  },
  {
    path: 'ipr_list',
    loadChildren: () => import('./ipr-list/ipr-list.module').then(m => m.IprListModule),
    data: {keepLive: true}
  },
  {
    path: 'copyright_dataset_list',
    loadChildren: () => import('./copyright-dataset-list/copyright-dataset-list.module').then(m => m.CopyrightDatasetListModule),
    data: {keepLive: true}
  },
  {
    path: 'copyright_checkin_list',
    loadChildren: () => import('./copyright-checkin-list/copyright-checkin-list.module').then(m => m.CopyrightCheckinListModule),
    data: {keepLive: true}
  },
  {
    path: 'copyright_offset_list',
    loadChildren: () => import('./copyright-offset-list/copyright-offset-list.module').then(m => m.CopyrightOffsetListModule),
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
export class SystemRoutingModule {
}
