import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class UserService   {

  constructor(public http: HttpClient) {
  }


  getById(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/users/get_by_id/' + id, HD.toGetOptions({}));
  }

  searchRolesById(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/users/search_roles_by_id/' + id, HD.toGetOptions({}));
  }

  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/users/search', HD.toGetOptions(query));
  }

  searchByOrganization(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/users/search_by_organization', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/users/search_at_page', HD.toGetOptions(query));
  }

  removeAction(id: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/users/remove/" + id);
  }

  resetPasswordAction(id: any): Observable<any> {
    return this.http.put("/openapi/api/v1/users/reset_password/" + id, HD.toPutOptions({}));
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/users/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/users/save/" + form.id, HD.toPutOptions(form));
    }

  }
}

