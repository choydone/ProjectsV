import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class RoleService   {

  constructor(public http: HttpClient) {
  }

  initAuthorizeData(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/roles/init_authorize_data', HD.toGetOptions(query));
  }

  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/roles/search', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/roles/search_at_page', HD.toGetOptions(query));
  }

  searchAtResource(id: any): Observable<any> {
    return this.http.get('/openapi/api/v1/roles/search_at_resource/' + id);
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete('/openapi/api/v1/roles/remove/' + form.id);
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/roles/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/roles/save/" + form.id, HD.toPutOptions(form));
    }
  }

  saveRoleResourceAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/roles/save_role_resource/" + form.id, HD.toPostOptions(form));
  }


}
