import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpData} from "../../shared/http-data";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpData {

  constructor(public http: HttpClient) {
    super();
  }

  login(form: any): Observable<any> {
    console.debug('登录操作，请求参数：', form);
    return this.http.post('/cloud/oauth/token', this.toPostOptions(form));
  }

  getPrincipal(): Observable<any> {
    return this.http.get('/oauth/api/v1/users/get_principal', {});
  }



  logout(): Observable<any> {
    return this.http.get('/cloud/oauth/logout', {});
  }
}
