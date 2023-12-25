import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {LoginService} from "../../../shared/admin/login.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {P, R} from "../../../starter/utils/utils";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = {};
  // 权限表单
  validateForm!: UntypedFormGroup;

  nzBtnLoading = false;

  constructor(private fb: FormBuilder, private message: NzMessageService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      id: [null],
      userName: [null, [Validators.required]],
      realName: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      email: [null, [Validators.required]],
      remarks: [null]
    });

    this.getPrincipal();
  }

  getPrincipal(): void {
    const observable: Observable<R> = this.loginService.getPrincipal();
    observable.subscribe((data) => {
      if (R.isSuccess(data)) {
        this.user = data.t;
        this.validateForm.get("id")?.setValue(this.user.id);
        this.validateForm.get("userName")?.setValue(this.user.userName);
        this.validateForm.get("realName")?.setValue(this.user.realName);
        this.validateForm.get("mobile")?.setValue(this.user.mobile);
        this.validateForm.get("email")?.setValue(this.user.email);
        this.validateForm.get("remarks")?.setValue(this.user.remarks);
      }
    });
  }

  savaForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.nzBtnLoading = true;
      // 提交数据
      const form: any = {};
      form.remarks = P.preText(this.validateForm.get('remarks')?.value);
      const observable: Observable<R> = this.loginService.saveRemarks(form);
      observable.subscribe((data) => {
        this.nzBtnLoading = false;
        if (R.isSuccess(data)) {
          this.message.info(data.t);
          this.getPrincipal();
        }
      });
    }
  }

}
