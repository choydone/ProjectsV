import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const manageRoutes: Routes = [
  {
    path: '', redirectTo: 'user_list', pathMatch: 'full',
  },
  {
    path: 'user_list',
    loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
    data: {keepLive: true}
  },
  {
    path: 'role_list',
    loadChildren: () => import('./role-list/role-list.module').then(m => m.RoleListModule),
    data: {keepLive: true}
  },
  {
    path: 'menu_list',
    loadChildren: () => import('./menu-list/menu-list.module').then(m => m.MenuListModule),
    data: {keepLive: true}
  },
  {
    path: 'permission_list',
    loadChildren: () => import('./permission-list/permission-list.module').then(m => m.PermissionListModule),
    data: {keepLive: true}
  },
  {
    path: 'logger_list',
    loadChildren: () => import('./logger-list/logger-list.module').then(m => m.LoggerListModule),
    data: {keepLive: true}
  },
  {
    path: 'login_logger_list',
    loadChildren: () => import('./login-logger-list/login-logger-list.module').then(m => m.LoginLoggerListModule),
    data: {keepLive: true}
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
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
