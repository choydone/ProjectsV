import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzMessageModule} from 'ng-zorro-antd/message';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzDividerModule,
    NzTabsModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
}
