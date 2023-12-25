import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class IprService  {

  constructor(public http: HttpClient) {
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/ipr/search_at_page', HD.toGetOptions(query));
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete('/openapi/api/v1/ipr/remove/' + form.id);
  }

  additionalAction(form: any): Observable<any> {
    return this.http.put("/openapi/api/v1/ipr/additional/" + form.id, HD.toPutOptions(form));
  }

  exportAction(query: any): Observable<any> {
    return this.http.post('/openapi/api/v1/ipr/export', HD.toPostOptions(query));
  }

}

