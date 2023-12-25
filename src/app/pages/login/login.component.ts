import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from "../../shared/admin/login.service";
import {R} from "../../starter/utils/utils";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validateForm!: UntypedFormGroup;

  loginBtnLoading = false;

  constructor(private fb: UntypedFormBuilder, private router: Router, private loginService: LoginService) {
  }



  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  /**
   * 保存菜单事件
   */
  loginAction(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.loginBtnLoading = true;

      const form: any = this.validateForm.value;
      const observable: Observable<R> = this.loginService.login(form);
      observable.subscribe((data) => {
        this.loginBtnLoading = false;
        if (R.isSuccess(data)) {
          this.router.navigate(['/welcome']).then(r => console.log(r));
        }
      });
    }

  }

}
