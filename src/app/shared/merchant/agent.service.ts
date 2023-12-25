import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class AgentService  {

  constructor(public http: HttpClient) {
  }

  search(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/agent/search', HD.toGetOptions(query));
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/agent/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/agent/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/agent/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(id: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/agent/remove/" + id, HD.toDeleteOptions({}));
  }

  resetPasswordAction(id: any): Observable<any> {
    return this.http.put("/openapi/api/v1/agent/reset_password/" + id, HD.toPutOptions({}));
  }
}

