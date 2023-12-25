import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(public http: HttpClient) {
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/permissions/search_at_page', HD.toGetOptions(query));
  }

  removeAction(id: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/permissions/remove/" + id);
  }

  saveAction(form: any): Observable<any> {
    if (U.NumberUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/permissions/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/permissions/save/" + form.id, HD.toPutOptions(form));
    }

  }


}
