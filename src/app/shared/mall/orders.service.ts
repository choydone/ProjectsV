import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class OrdersService  {

  constructor(public http: HttpClient) {
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders/search_at_page', HD.toGetOptions(query));
  }

  saveAction(form: any): Observable<any> {
    if (U.ObjectUtils.isNull(form.id)) {
      return this.http.post("/openapi/api/v1/orders/save", HD.toPostOptions(form));
    } else {
      return this.http.put("/openapi/api/v1/orders/save/" + form.id, HD.toPutOptions(form));
    }
  }

  removeAction(form: any): Observable<any> {
    return this.http.delete("/openapi/api/v1/orders/remove/" + form.id, HD.toDeleteOptions(form));
  }

  exportAction(query: any): Observable<any> {
    return this.http.post('/openapi/api/v1/orders/export', HD.toPostOptions(query));
  }


  copyrightConfirmedAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders/copyright_confirmed/" + form.id, HD.toPostOptions(form));
  }


}

