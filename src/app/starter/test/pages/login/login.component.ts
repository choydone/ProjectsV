import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {Result} from "../../../model/result";
import {ResultFilter} from "../../../utils/result-filter";
import {Router} from "@angular/router";
import {LoginService} from "../../shared/login.service";
import {SecurityService} from "../../../shared/security-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private router: Router, private loginService: LoginService,
              private securityService: SecurityService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['18500000001', [Validators.required]],
      password: ['123456', [Validators.required]],
      grant_type: ["password", [Validators.required]],
      client_id: ["client", [Validators.required]],
      client_secret: ["12345623333", [Validators.required]],
      remember: [true]
    });
  }


  login(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }
    if (this.validateForm.valid) {
      const form: any = this.validateForm.value;
      const observable: Observable<Result<any>> = this.loginService.login(form);
      observable.subscribe((data) => {
        if (ResultFilter.isSuccess(data)) {
          // this.securityService.saveAuthorization(data.t);
          this.router.navigate(['/manage']);
        }
      });
    }
  }
}
