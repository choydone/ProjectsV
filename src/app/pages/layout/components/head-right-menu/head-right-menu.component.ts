import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {LoginService} from 'src/app/shared/admin/login.service';
import {Router} from "@angular/router";
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {R} from "../../../../starter/utils/utils";

@Component({
  selector: 'app-head-right-menu',
  templateUrl: './head-right-menu.component.html',
  styleUrls: ['./head-right-menu.component.scss']
})
export class HeadRightMenuComponent implements OnInit {
  /**
   * 登录用户对象信息
   */
  user: any = {};

  // 密码修改
  nzChangePasswordModalVisible = false;
  nzChangePasswordModalBtnLoading = false;
  validateChangePasswordForm!: UntypedFormGroup;

  // 锁屏幕
  nzLockScreenModalVisible = false;
  nzLockScreenModalBtnLoading = false;
  validateLockScreenForm!: UntypedFormGroup;

  // 个人资料
  profileVisible = false;

  constructor(private router: Router, private fb: FormBuilder, private message: NzMessageService,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    // 获取当前登录信息
    this.getPrincipal();

    this.validateChangePasswordForm = this.fb.group({
      password: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [this.confirmValidator]]
    });

    this.validateLockScreenForm = this.fb.group({
      password: [null, [Validators.required]],
    });


  }

  getPrincipal() {
    const observable: Observable<R> = this.loginService.getPrincipal();
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.user = data.t;
        if (this.user.lockScreen == 10) {
          this.lockScreenAction();
        }
      }
    });
  }

  logout() {
    const observable: Observable<R> = this.loginService.logout();
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        // 清理客户端缓存记录
        console.info(" 登录退出,清楚客户端缓存记录.")
        this.router.navigate(['/login']).then(r => console.log("退出，返回登录页面"));
      }
    });
  }

  clearCache() {
    // Logger.debug("清楚缓存操作,还未实现.")
  }

  /**
   *  修改密码
   */
  validateConfirmPassword(): void {
    // @ts-ignore
    setTimeout(() => this.validateChangePasswordForm.controls.confirmPassword.updateValueAndValidity());
  }

  confirmValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else { // @ts-ignore
      if (control.value !== this.validateChangePasswordForm.controls.newPassword.value) {
        return {confirm: true, error: true};
      }
    }
    return {};
  };

  openChangePasswordViewAction(): void {
    this.validateChangePasswordForm.reset();
    this.nzChangePasswordModalVisible = true;
    this.nzChangePasswordModalBtnLoading = false;
  }

  closeChangePasswordViewAction(): void {
    this.validateChangePasswordForm.reset();
    this.nzChangePasswordModalVisible = false;
    this.nzChangePasswordModalBtnLoading = false;
  }

  saveChangePasswordAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateChangePasswordForm.controls) {
      this.validateChangePasswordForm.controls[i].markAsDirty();
      this.validateChangePasswordForm.controls[i].updateValueAndValidity();
    }
    if (this.validateChangePasswordForm.valid) {
      this.nzChangePasswordModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.oldPassword = this.validateChangePasswordForm.get('password')?.value;
      form.password = this.validateChangePasswordForm.get('newPassword')?.value;
      const observable: Observable<R> = this.loginService.changePasswordAction(form);
      observable.subscribe((data) => {
        this.nzChangePasswordModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info("密码修改成功，请记住您的密码！");
          this.closeChangePasswordViewAction();
        }
      });
    }
  }

  closeLockScreenViewAction(): void {
    this.validateLockScreenForm.reset();
    this.nzLockScreenModalVisible = false;
    this.nzLockScreenModalBtnLoading = false;
  }

  lockScreenAction(): void {
    const observable: Observable<R> = this.loginService.lockScreenAction();
    observable.subscribe((data) => {
      this.nzChangePasswordModalBtnLoading = false;
      if (R.isSuccess(data)) {
        this.validateLockScreenForm.reset();
        this.nzLockScreenModalVisible = true;
        this.nzLockScreenModalBtnLoading = false;
      }
    });
  }

  unlockScreenAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateLockScreenForm.controls) {
      this.validateLockScreenForm.controls[i].markAsDirty();
      this.validateLockScreenForm.controls[i].updateValueAndValidity();
    }
    if (this.validateLockScreenForm.valid) {
      this.nzLockScreenModalBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.password = this.validateLockScreenForm.get('password')?.value;
      const observable: Observable<R> = this.loginService.unlockScreenAction(form);
      observable.subscribe((data) => {
        this.nzChangePasswordModalBtnLoading = false;
        if (R.isSuccess(data)) {
          this.closeLockScreenViewAction();
        }
      });
    }
  }

  /**
   * 个人资料
   */
  openProfileViewAction(): void {
    this.profileVisible = true;
  }
  closeProfileViewAction():void{
    this.profileVisible = false;
  }

}
