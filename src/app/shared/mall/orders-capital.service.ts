import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HD, U} from "../../starter/utils/utils";


@Injectable({
  providedIn: 'root'
})
export class OrdersCapitalService {

  constructor(public http: HttpClient) {
  }

  searchAtPage(query: any): Observable<any> {
    return this.http.get('/openapi/api/v1/orders_capital/search_at_page', HD.toGetOptions(query));
  }

  receivedAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_capital/received/" + form.id, HD.toPostOptions(form));
  }

  expiredAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_capital/expired/" + form.id, HD.toPostOptions(form));
  }

  additionalAction(form: any): Observable<any> {
    return this.http.post("/openapi/api/v1/orders_capital/additional/" + form.id, HD.toPostOptions(form));
  }

  exportAction(query: any): Observable<any> {
    return this.http.get("/openapi/api/v1/orders_capital/export", HD.toGetOptions(query));
  }


}

