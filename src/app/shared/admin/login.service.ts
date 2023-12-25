import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HD} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class LoginService  {

  constructor(public http: HttpClient) {
  }

  login(form: any): Observable<any> {
    console.debug('登录操作，请求参数：', form);
    return this.http.post('/openapi/api/v1/user/login', HD.toPostOptions(form));
  }

  getPrincipal(): Observable<any> {
    return this.http.get('/openapi/api/v1/user/get_principal', {});
  }

  searchResourceByPrincipal(): Observable<any> {
    return this.http.get('/openapi/api/v1/user/search_resource_by_principal', {});
  }

  logout(): Observable<any> {
    return this.http.post('/openapi/api/v1/user/logout', {});
  }

  changePasswordAction(form: any): Observable<any> {
    return this.http.post('/openapi/api/v1/user/change_password', HD.toPostOptions(form));
  }

  lockScreenAction(): Observable<any> {
    return this.http.post('/openapi/api/v1/user/lock_screen', HD.toPostOptions({}));
  }

  unlockScreenAction(form: any): Observable<any> {
    return this.http.post('/openapi/api/v1/user/unlock_screen', HD.toPostOptions(form));
  }

  saveRemarks(form: any): Observable<any> {
    return this.http.post('/openapi/api/v1/user/save_remarks', HD.toPostOptions(form));
  }

}
